from flask import current_app, request
import stripe

app = current_app

sessions_map = {}

stripe.api_key = app.config.get('STRIPE_API_KEY')

@app.route("/payment", methods=['POST'])
def init_payment():

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
        cancel_url=f"{app.config.get('SITE_URL')}/payment/cancel",
        locale='en'
    )

    sessions_map[session.id] = int(args["order_id"])

    return {
        "stripe_url": session.url
    }


@app.route("/stripe_webhook")
def accept_webhook():
    pass
