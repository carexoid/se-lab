from flask_admin.contrib.peewee import ModelView
from ..chief import db
from wtforms import fields

class UserView(ModelView):
    pass


class AirportView(ModelView):
    pass


class DirectionView(ModelView):
    pass


class FlightView(ModelView):
    form_extra_fields = {
        'econom': fields.IntegerField('Number of econom tickets'),
        'business': fields.IntegerField('Number of business fields')
    }


class OrderView(ModelView):
    form_choises = {"state" : 
        [
            (db.Order.State.active, db.Order.State.active.value),
            (db.Order.State.completed, db.Order.State.completed.value)
        ]
    }


class TicketView(ModelView):
    pass


class PaymentView(ModelView):
    pass
