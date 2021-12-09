import requests
from flask import current_app, request
import stripe

app = current_app
sessions_map = {}

stripe.api_key = app.config.get('STRIPE_API_KEY')


@app.route("/checkout", methods=['POST'])
def generate_checkout():

    args = request.get_json()

    prices: list[stripe.Price] = []
    for ticket in args["tickets"]:
        product = stripe.Product.create(
            name=f"Ticket to {ticket['airport_name']}, {ticket['city']}, seat {ticket['seat']}"
        )
        price = stripe.Price.create(
            product=product,
            unit_amount=int(ticket['price']) * 100,
            currency='usd',
        )
        prices.append(price)

    discounts = []
    if "bonuses" in args and args["bonuses"] != 0:
        discounts.append({
            'coupon': stripe.Coupon.create(currency='usd', amount_off=int(args["bonuses"]) * 100, duration="once")
        })

    items = list(map(lambda p: {'price': p, 'quantity': 1}, prices))

    session = stripe.checkout.Session.create(
        line_items=items,
        mode='payment',
        discounts=discounts,
        success_url=f"{app.config.get('SITE_URL')}/payment/success?order_id={args['order_id']}",
        cancel_url=f"{app.config.get('SITE_URL')}/payment/cancel?order_id={args['order_id']}",
        locale='en'
    )

    sessions_map[int(args["order_id"])] = session

    return {
        "stripe_url": session.url
    }


@app.route("/checkout/<int:order_id>")
def resend_checkout(order_id):
    if order_id not in sessions_map:
        return "No session for this order", 400
    return {
        "stripe_url": sessions_map[order_id].url
    }


@app.route("/stripe_webhooks", methods=['POST'])
def accept_webhook():
    payload = request.data
    sig_header = request.headers['STRIPE_SIGNATURE']
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, app.config.get('STRIPE_WEBHOOK_SECRET')
        )
    except ValueError as e:
        # Invalid payload
        return "Invalid payload", 400
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        return "SignatureVerificationError", 400

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']

        order_id = None
        for k, v in sessions_map.items():
            if v.id == session.id:
                order_id = k
                break

        if order_id is None:
            return "Order_id is not in sessions_map", 400

        r = requests.put(f"{app.config.get('CHIEF_URL')}/order/{order_id}/success",
                         json={'bonuses_used': (session['amount_subtotal'] - session['amount_total']) / 100})

    return "", 200


