from flask import current_app, request
import stripe

stripe.api_key = 'sk_test_51K1efbCVEPKwWrcQsRyzDz7rTuMRBdycalufzXKBTF2pg3CUvSxMbiz7cHmWbDCYHc0LPI11ybiF7tflNhTDoEqX00MUObz6Qk'

app = current_app

sessions_map = {}


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
        success_url='https://example.com/success',
        cancel_url='https://example.com/failure',
        locale='en'
    )

    sessions_map[session.id] = int(args["order_id"])

    return {
        "stripe_url": session.url
    }


@app.route("/stripe_webhook")
def accept_webhook():
    pass
