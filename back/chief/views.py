from datetime import datetime
from flask import current_app, request, redirect
from peewee import JOIN, fn
from flask_httpauth import HTTPTokenAuth
from playhouse.shortcuts import model_to_dict
import requests
import json
from . import db

app = current_app
auth = HTTPTokenAuth(scheme='Bearer')


@auth.verify_token
def verify_token(token):
    r = requests.get(f"{app.config.get('GOTRUE_URL')}/user", headers={"Authorization": f"Bearer {token}"})
    if r.status_code != 200:
        return
    user = db.User.get_or_none(db.User.auth_id == r.json()["id"])
    if user is None:
        user = db.User.create(auth_id=r.json()["id"],
                              created_at=r.json()["created_at"],
                              bonuses=0)
    return user


def send_error(text: str):
    return {
               "error": text
           }, 400


@app.errorhandler(ValueError)
def handle_bad_request(e):
    return send_error("Bad request")


def make_available_tickets_query(t: db.Ticket.Type):
    return (db.Ticket.select(db.Ticket.flight, db.Ticket.price)
            .where(db.Ticket.order.is_null())
            .where(db.Ticket.type == t))


@app.route("/flights")
def get_flights():
    econom = make_available_tickets_query(db.Ticket.Type.econom)
    business = make_available_tickets_query(db.Ticket.Type.business)
    flights = (db.Flight.select(db.Flight,
                                (db.Flight.arrival_at.to_timestamp() -
                                 db.Flight.departure_at.to_timestamp()).alias("duration"),
                                db.Airport.city,
                                db.Airport.name.alias("airport_name"),
                                fn.COUNT(business.c.flight_id).alias("business_remaining"),
                                fn.COUNT(econom.c.flight_id).alias("econom_remaining"),
                                fn.MIN(econom.c.price).alias("econom_min_price"),
                                fn.MIN(business.c.price).alias("business_min_price")))
    if "number" in request.args:
        flights = flights.where(db.Flight.id == int(request.args.get("number")))
    if "arrival_at" in request.args:
        date = datetime.strptime(request.args.get("arrival_at"), "%Y-%m-%d")
        flights = flights.where(db.Flight.arrival_at.year == date.year and
                                db.Flight.arrival_at.month == date.month and
                                db.Flight.arrival_at.day == date.day)
    if "min_departure_time" in request.args:
        date = datetime.strptime(request.args.get("min_departure_time"), "%Y-%m-%d %H:%M:%S")
        flights = flights.where(db.Flight.departure_at >= date)
    if "max_departure_time" in request.args:
        date = datetime.strptime(request.args.get("max_departure_time"), "%Y-%m-%d %H:%M:%S")
        flights = flights.where(db.Flight.departure_at <= date)
    if "min_duration" in request.args:
        flights = flights.where(
            db.Flight.arrival_at.to_timestamp() - db.Flight.departure_at.to_timestamp()
            >= int(request.args.get("min_duration")))
    if "max_duration" in request.args:
        flights = flights.where(
            db.Flight.arrival_at.to_timestamp() - db.Flight.departure_at.to_timestamp()
            <= int(request.args.get("max_duration")))

    flights = (flights.join(db.Direction, JOIN.LEFT_OUTER)
               .join(db.Airport, JOIN.LEFT_OUTER))

    if "airport" in request.args:
        flights = flights.where(db.Airport.name == request.args.get("airport"))
    if "city" in request.args:
        flights = flights.where(db.Airport.city == request.args.get("city"))

    if "min_price" in request.args or "max_price" in request.args:
        flights = flights.join(db.Ticket, join_type=JOIN.LEFT_OUTER, on=(db.Ticket.flight == db.Flight.id))
        if "min_price" in request.args:
            flights = flights.where(db.Ticket.price >= request.args.get("min_price"))
        if "max_price" in request.args:
            flights = flights.where(db.Ticket.price <= request.args.get("max_price"))

    flights = (flights.join(business, join_type=JOIN.LEFT_OUTER, on=(db.Flight.id == business.c.flight_id))
               .join(econom, join_type=JOIN.LEFT_OUTER, on=(db.Flight.id == econom.c.flight_id))
               .group_by(db.Flight.id))
    if "business_remaining" in request.args:
        flights = flights.having(fn.COUNT(business.c.flight_id) >= int(request.args.get("business_remaining")))
    if "econom_remaining" in request.args:
        flights = flights.having(fn.COUNT(econom.c.flight_id) >= int(request.args.get("econom_remaining")))

    return {
        "flights": list(flights.dicts())
    }


@app.route("/flights/<int:flight_id>")
def get_flight_info(flight_id):
    if db.Flight.get_or_none(db.Flight.id == flight_id) is None:
        return send_error("Flight not found")

    econom = make_available_tickets_query(db.Ticket.Type.econom)
    business = make_available_tickets_query(db.Ticket.Type.business)

    flight = (db.Flight.select(db.Flight,
                               (db.Flight.arrival_at.to_timestamp() -
                                db.Flight.departure_at.to_timestamp()).alias("duration"),
                               db.Airport.city,
                               db.Airport.name.alias("airport_name"),
                               db.Airport.id.alias("airport_id"),
                               fn.COUNT(business.c.flight_id).alias("business_remaining"),
                               fn.COUNT(econom.c.flight_id).alias("econom_remaining"),
                               fn.MIN(business.c.price).alias("business_min_price"),
                               fn.MIN(econom.c.price).alias("econom_min_price"))
              .where(db.Flight.id == flight_id)
              .join(db.Direction, JOIN.LEFT_OUTER)
              .join(db.Airport, JOIN.LEFT_OUTER)
              .join(business, join_type=JOIN.LEFT_OUTER, on=(db.Flight.id == business.c.flight_id))
              .join(econom, join_type=JOIN.LEFT_OUTER, on=(db.Flight.id == econom.c.flight_id))
              .group_by(db.Flight.id)
              .dicts()
              )

    return flight.get()


@app.route("/cities")
def get_cities():

    query = db.Airport.select(db.Airport.city).distinct().dicts()
    return {
        "cities": list(query)
    }


@app.route("/flight_ids")
def get_flight_ids():
    query = db.Flight.select(db.Flight.id).dicts()
    return {
        "ids": sorted(map(lambda obj: obj["id"], query))
    }


@app.route("/flights/<int:flight_id>/tickets")
def get_tickets(flight_id):
    def make_tickets_query(t: db.Ticket.Type):
        available = (db.Ticket.select(db.Ticket.flight, db.Ticket.seat, db.Ticket.price)
                     .where(db.Ticket.order.is_null())
                     .where(db.Ticket.type == t))

        return (db.Flight.select(available.c.seat, available.c.price)
                .where(db.Flight.id == flight_id)
                .join(available, on=(db.Flight.id == available.c.flight_id)))

    if db.Flight.get_or_none(db.Flight.id == flight_id) is None:
        return send_error("Flight not found")

    econom = make_tickets_query(db.Ticket.Type.econom)
    business = make_tickets_query(db.Ticket.Type.business)

    return {
        "econom": list(econom.dicts()),
        "business": list(business.dicts())
    }


@app.route("/account", methods=["GET", "DELETE"])
@auth.login_required()
def get_my_info():

    if request.method == "GET":
        query = db.User.select(db.User.id.alias("user_id"), db.User.bonuses).where(db.User.id == auth.current_user().id)
        res = query.dicts().get_or_none()
        return res if res else send_error("User not found")

    if request.method == "DELETE":
        query = db.User.delete().where(db.User.id == auth.current_user().id)
        return "" if query.execute() == 1 else send_error("User not found")


@app.route("/account/history")
@auth.login_required
def get_history():

    orders = (db.Order.select(db.Order, db.Payment.amount.alias("payment_amount"))
              .join(db.User)
              .where(db.User.id == auth.current_user().id)
              .join(db.Payment, on=(db.Payment.order == db.Order.id)))

    res = []
    for order in list(orders.dicts()):
        res.append({
            "order_id": order["id"],
            "created_at": order["created_at"],
            "state": order["state"]
        })
        tickets = (db.Ticket.select(db.Ticket)
                   .join(db.Order)
                   .where(db.Order.id == order["id"])
                   .join(db.Flight, on=(db.Ticket.flight == db.Flight.id))
                   .join(db.Direction))
        res[-1]["tickets"] = [model_to_dict(t) for t in tickets]
        for t in res[-1]["tickets"]:
            flight = t["flight"]
            flight["city"] = flight["direction"]["to"]["city"]
            flight["airport_name"] = flight["direction"]["to"]["name"]
            del flight["direction"]

        for ticket in res[-1]["tickets"]:
            ticket.pop("order")  # not needed in history

        q = (db.Ticket.select(fn.SUM(db.Ticket.price), fn.SUM(db.Flight.distance))
             .join(db.Order)
             .where(db.Order.id == order["id"])
             .join(db.Flight, on=(db.Flight.id == db.Ticket.flight))
             .group_by(db.Order.id).dicts().get())
        res[-1]["bonuses_added"] = q["distance"]
        res[-1]["bonuses_used"] = q["price"] - order["payment_amount"]
        res[-1]["full_price"] = q["price"]

    return {
        "orders": res
    }


@app.route("/order/<int:order_id>")
@auth.login_required
def get_order(order_id):
    order = db.Order.get_or_none(db.Order.id == order_id)

    if order is None:
        return send_error("Order does not exist")
    if order.user.id != auth.current_user().id:
        return "Access to this order is forbidden", 403

    res = {
        "order_id": order.id,
        "created_at": order.created_at,
        "state": order.state
    }

    tickets = (db.Ticket.select(db.Ticket)
               .join(db.Order)
               .where(db.Order.id == order.id)
               .join(db.Flight, on=(db.Ticket.flight == db.Flight.id))
               .join(db.Direction))
    res["tickets"] = [model_to_dict(t) for t in tickets]
    for t in res["tickets"]:
        flight = t["flight"]
        flight["city"] = flight["direction"]["to"]["city"]
        flight["airport_name"] = flight["direction"]["to"]["name"]
        del flight["direction"]

    for ticket in res["tickets"]:
        ticket.pop("order")  # not needed in order

    q = (db.Ticket.select(fn.SUM(db.Ticket.price), fn.SUM(db.Flight.distance))
         .join(db.Order)
         .where(db.Order.id == order.id)
         .join(db.Flight, on=(db.Flight.id == db.Ticket.flight))
         .group_by(db.Order.id)
         .having(fn.COUNT(db.Ticket.price) > 0)
         .dicts())
    t = list(q)
    if len(t) > 0:
        res["full_price"] = t[0]["price"]
        payment = db.Payment.get_or_none(db.Payment.order == order_id)
        if payment is not None:
            res["bonuses_added"] = t[0]["distance"]
            res["bonuses_used"] = t[0]["price"] - payment.amount

    return res


def make_order_with_params(user_id: int, params: dict):
    tickets = params["tickets"]

    if len(tickets) == 0:
        return send_error("Bad request: Empty tickets list")

    bonuses_requested = int(params.get("use_bonuses", 0))

    if bonuses_requested > db.User.get(db.User.id == user_id).bonuses:
        return send_error("Bad request: invalid bonuses")

    order = db.Order.create(user=db.User.get(db.User.id == user_id),
                            created_at=datetime.now(),
                            state=db.Order.State.active)

    comment = params.get("comment", None)
    if comment is not None:
        order.info = comment
        order.save()

    tickets_descs = []

    for ticket in tickets:
        flight = db.Flight.get_or_none(db.Flight.id == ticket["flight_id"])

        if flight is None:
            return send_error(f"Bad request: flight_id {ticket['flight_id']} is not exist")

        ticket_record = db.Ticket.get_or_none(db.Ticket.flight == flight and db.Ticket.seat == ticket["seat"])

        # if ticket_record is None or ticket_record.order is not None:
        #     return send_error(f"Bad request: invalid ticket")

        tickets_descs.append({
            "airport_name": flight.direction.to.name,
            "city": flight.direction.to.city,
            "price": ticket_record.price,
            "seat": ticket_record.seat
        })
        ticket_record.order = order
        ticket_record.save()

    if params.get("type") == 'offline':
        return {
            "order_id": order.id,
            "tickets": tickets_descs
        } | ({} if params.get("comment", None) is None else {"comment": params.get("comment")})

    response = requests.post(f'{app.config.get("PAYMENT_SERVICE")}/checkout', json={
        "order_id": order.id,
        "bonuses": bonuses_requested,
        "tickets": tickets_descs
    })

    if response.status_code != 200:
        return response.text, response.status_code

    return redirect(response.json()["stripe_url"], 303)


@app.route("/booking", methods=['POST'])
@auth.login_required
def make_order():
    return make_order_with_params(auth.current_user().id, request.get_json())


@app.route("/crutched_booking", methods=['POST'])
@auth.login_required
def make_order_crutched():
    import urllib
    raw = urllib.parse.unquote(request.args.get('body'))
    return make_order_with_params(auth.current_user().id, json.loads(raw))


@app.route("/booking/<int:order_id>", methods=['POST'])
@auth.login_required
def make_reorder(order_id):

    response = requests.get(f'{app.config.get("PAYMENT_SERVICE")}/checkout/{order_id}')

    if response.status_code != 200:
        return response.text, response.status_code

    return redirect(response.json()["stripe_url"], 303)


# Currently unused, should be called from payment service
@app.route("/confirm_order", methods=['POST'])
def confirm_order():
    form = request.get_json()

    order = db.Order.get_or_none(db.Order.id == form["order_id"])
    if order is None:
        return send_error("Order is already complete")

    user = order.user

    if "bonuses_used" in form:
        user.bonuses -= int(form["bonuses_used"])

    user.bonuses += (db.Ticket.select(fn.SUM(db.Flight.distance).alias("res"))
                     .join(db.Order)
                     .where(db.Order.id == order.id)
                     .join(db.Flight, on=(db.Ticket.flight == db.Flight.id))
                     .group_by(db.Flight.id)
                     .dicts()
                     .get())["res"]
    user.save()

    order.state = db.Order.State.completed
    order.save()

    return ""
