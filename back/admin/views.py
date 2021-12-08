from flask_admin.contrib.peewee import ModelView, filters
from wtforms import fields
from wtfpeewee.orm import model_form
from peewee import fn
from back.chief import db


class BaseModelView(ModelView):
    column_display_pk = True


class UserView(BaseModelView):
    can_create = False
    column_filters = ("id", "auth_id")

    @staticmethod
    def _user_has_access_impl(model):
        return db.BannedUser.select(fn.COUNT(db.BannedUser.id))\
            .where(db.BannedUser.id == model.id).scalar() == 0

    def _user_has_access(self, context, model, name):
        return UserView._user_has_access_impl(model)

    column_formatters = {
        'has_access': _user_has_access
    }

    def get_column_names(self, only_columns, excluded_columns):
        only_columns.append('has_access')
        return super().get_column_names(only_columns, excluded_columns)

    form_extra_fields = {
        "has_access": fields.BooleanField("Has access")
    }

    def after_model_change(self, form, model, is_created):
        if not is_created:
            has_access = UserView._user_has_access_impl(model)
            will_have_access = form.data["has_access"]
            print(will_have_access)

            if has_access and not will_have_access:
                db.BannedUser.create(id=model.id)

            if not has_access and will_have_access:
                print(model.id)
                db.BannedUser.delete().where(db.BannedUser.id == model.id).execute()

        return super().after_model_change(form, model, is_created)

    def on_model_delete(self, model):
        db.BannedUser.delete().where(db.BannedUser.id == model.id).execute()
        return super().on_model_delete(model)


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
        db.Ticket.delete().where(db.Ticket.flight == model.id).execute()
        return super().on_model_delete(model)


class OrderView(BaseModelView):
    can_create = False
    column_filters = ("id", filters.FilterEqual(
        column=db.Order.user, name="User"))
    form_excluded_columns = ("user", "created_at")

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
