from flask_admin.contrib.peewee import ModelView, filters
from jinja2.utils import contextfunction
from ..chief import db
from wtforms import fields
from peewee import fn

# Well, this looks ugly, but I haven't found any
# other way to make it work with connection pool nicely
class BaseModelView(ModelView):
    column_display_pk = True

    @db.database.connection_context()
    def on_model_change(self, form, model, is_created):
        return super().on_model_change(form, model, is_created)

    @db.database.connection_context()
    def on_model_delete(self, model):
        return super().on_model_delete(model)
    
    @contextfunction
    @db.database.connection_context()    
    def get_list_value(self, context, model, name):
        return super().get_list_value(context, model, name)
    
    @contextfunction
    @db.database.connection_context()    
    def get_detail_value(self, context, model, name):
        return super().get_detail_value(context, model, name)

    @db.database.connection_context()    
    def get_pk_value(self, model):
        return super().get_pk_value(model)

    @db.database.connection_context()
    def get_one(self, id):
        return super().get_one(id)
    
    @db.database.connection_context()
    def update_model(self, form, model):
        return super().update_model(form, model)

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
    @db.database.connection_context()
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
            
    @db.database.connection_context()
    def on_model_delete(self, model):
        db.Ticket.delete().where(db.Ticket.flight == model.id)
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
