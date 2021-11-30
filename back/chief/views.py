from datetime import datetime
from flask import current_app, request
from peewee import JOIN, fn
from flask_httpauth import HTTPTokenAuth
from playhouse.shortcuts import model_to_dict

from . import db

app = current_app
auth = HTTPTokenAuth(scheme='Bearer')


@auth.verify_token
def verify_token(token):
    return {"id": 1}  # TODO authorization


def send_error(text: str):
    return {
        "error": text
    }, 400


@app.errorhandler(ValueError)
def handle_bad_request(e):
    return send_error("Bad request")


def make_available_tickets_query(t: db.Ticket.Type):
    return (db.Ticket.select(db.Ticket.flight)
            .where(db.Ticket.order.is_null())
            .where(db.Ticket.type == t))


@app.route("/flights")
@db.database.connection_context()
def get_flights():
    econom = make_available_tickets_query(db.Ticket.Type.econom)
    business = make_available_tickets_query(db.Ticket.Type.business)

    flights = (db.Flight.select(db.Flight,
                                (db.Flight.arrival_at.to_timestamp() -
                                 db.Flight.departure_at.to_timestamp()).alias("duration"),
                                db.Airport.city,
                                db.Airport.name,
                                fn.COUNT(business.c.flight_id).alias("business_remaining"),
                                fn.COUNT(econom.c.flight_id).alias("econom_remaining")))
    if "number" in request.args:
        flights = flights.where(db.Flight.id == int(request.args.get("number")))
    if "arrival_at" in request.args:
        date = datetime.strptime(request.args.get("arrival_at"), "%Y-%m-%d")
        flights = flights.where(db.Flight.arrival_at.year == date.year and
                                db.Flight.arrival_at.month == date.month and
                                db.Flight.arrival_at.day == date.day)
    if "departure_at" in request.args:
        date = datetime.strptime(request.args.get("departure_at"), "%Y-%m-%d")
        flights = flights.where(db.Flight.departure_at.year == date.year and
                                db.Flight.departure_at.month == date.month and
                                db.Flight.departure_at.day == date.day)
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
@db.database.connection_context()
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
                               fn.COUNT(econom.c.flight_id).alias("econom_remaining"))
              .where(db.Flight.id == flight_id)
              .join(db.Direction, JOIN.LEFT_OUTER)
              .join(db.Airport, JOIN.LEFT_OUTER)
              .join(business, join_type=JOIN.LEFT_OUTER, on=(db.Flight.id == business.c.flight_id))
              .join(econom, join_type=JOIN.LEFT_OUTER, on=(db.Flight.id == econom.c.flight_id))
              .group_by(db.Flight.id)
              .dicts()
              )

    return flight.get()


@app.route("/flights/<int:flight_id>/tickets")
@db.database.connection_context()
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
@db.database.connection_context()
def get_my_info():
    user_id = auth.current_user()["id"]

    if request.method == "GET":
        query = db.User.select(db.User.id.alias("user_id"), db.User.bonuses).where(db.User.id == user_id)
        res = query.dicts().get_or_none()
        return res if res else send_error("User not found")

    if request.method == "DELETE":
        query = db.User.delete().where(db.User.id == user_id)
        return "" if query.execute() == 1 else send_error("User not found")


@app.route("/account/history")
@auth.login_required
@db.database.connection_context()
def get_history():
    user_id = auth.current_user()["id"]

    orders = (db.Order.select(db.Order, db.Payment.amount.alias("payment_amount"))
              .join(db.User)
              .where(db.User.id == user_id)
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
        for ticket in res[-1]["tickets"]:
            ticket.pop("order")  # not needed in history

        q = (db.Ticket.select(fn.SUM(db.Ticket.price), fn.SUM(db.Flight.distance))
             .join(db.Order)
             .where(db.Order.id == order["id"])
             .join(db.Flight, on=(db.Flight.id == db.Ticket.flight))
             .group_by(db.Order.id).dicts().get())
        res[-1]["bonuses_added"] = q["distance"]
        res[-1]["bonuses_used"] = q["price"] - order["payment_amount"]

    return {
        "orders": res
    }


@app.route("/booking/<int:flight_id>/<string:ticket_type>/<int:seat>")
@auth.login_required
@db.database.connection_context()
def make_order(flight_id, ticket_type, seat):
    pass
