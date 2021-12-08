from flask_admin.contrib.peewee import ModelView, filters
from wtforms import fields
from back.chief import db


class BaseModelView(ModelView):
    column_display_pk = True


class UserView(BaseModelView):
    can_create = False
    column_filters = ("id", "auth_id")


class AirportView(BaseModelView):
    column_filters = ("id", "name", "city")


class DirectionView(BaseModelView):
    column_filters = ("id", filters.FilterEqual(
        column=db.Direction.to, name="To"))


class FlightView(BaseModelView):
    column_filters = ("id", filters.FilterEqual(
        column=db.Flight.direction, name="Direction"))
    form_extra_fields = {
        "econom_number": fields.IntegerField("Number of econom tickets"),
        "econom_price": fields.IntegerField("Price of econom ticket"),
        "business_number": fields.IntegerField("Number of business tickets"),
        "business_price": fields.IntegerField("Price of business ticket")
    }

    @staticmethod
    def create_tickets(form, model):
        econom = form.data["econom_number"]
        flight_id = model.id
        for i in range(0, econom):
            db.Ticket.create(
                flight=flight_id,
                seat=i,
                order=None,
                type=db.Ticket.Type.econom,
                price=form.data["econom_price"]
            )
        for i in range(0, form.data["business_number"]):
            db.Ticket.create(
                flight=flight_id,
                seat=i + econom,
                order=None,
                type=db.Ticket.Type.business,
                price=form.data["business_price"]
            )

    def after_model_change(self, form, model, is_created):
        if is_created:
            FlightView.create_tickets(form, model)

    def on_model_delete(self, model):
        db.Ticket.delete().where(db.Ticket.flight == model.id)
        return super().on_model_delete(model)


class OrderView(BaseModelView):
    can_create = False
    column_filters = ("id", filters.FilterEqual(
        column=db.Order.user, name="User"))
    form_excluded_columns = ("user", "created_at")

    form_choises = {
        "state": [
            (0, "active"),
            (1, "completed")
        ]
    }

    def on_model_change(self, form, model, is_created):
        model.state = db.Order.State(form.data["state"])
        return super().on_model_change(form, model, is_created)


class PaymentView(BaseModelView):
    can_create = False
    can_edit = False
    column_filters = (filters.FilterEqual(
        column=db.Payment.order, name="Order"),)

    def on_model_change(self, form, model, is_created):
        model.state = db
        return super().on_model_change(form, model, is_created)


def get_views():
    return [
        UserView(db.User),
        AirportView(db.Airport),
        DirectionView(db.Direction),
        FlightView(db.Flight),
        OrderView(db.Order),
        PaymentView(db.Payment)
    ]
