from playhouse.flask_utils import FlaskDB
from flask.cli import with_appcontext
from playhouse.db_url import connect
from flask import current_app
import peewee as pw
import datetime
import click
import enum


database = connect(current_app.config['DATABASE'])
flask_db = FlaskDB(current_app, database)


class Model(flask_db.Model):
    class Meta:
        database = database


class UnsignedSmallIntegerField(pw.SmallIntegerField):
    field_type = 'SMALLINT UNSIGNED'


class User(Model):
    id = pw.PrimaryKeyField()
    auth_id = pw.CharField(max_length=64, unique=True)
    created_at = pw.DateTimeField(default=datetime.datetime.now)
    bonuses = UnsignedSmallIntegerField()
    info = pw.CharField(max_length=128)


class BannedUser(Model):
    id = pw.ForeignKeyField(User, primary_key=True, on_delete='CASCADE')


class Airport(Model):
    id = pw.PrimaryKeyField()
    name = pw.CharField(max_length=128)
    city = pw.CharField(max_length=64)
    info = pw.CharField(max_length=2048)


class Direction(Model):
    id = pw.PrimaryKeyField()
    to = pw.ForeignKeyField(
        Airport, backref='directions', on_delete='RESTRICT')


class Flight(Model):
    id = pw.PrimaryKeyField()
    direction = pw.ForeignKeyField(
        Direction, backref='flights', on_delete='RESTRICT')
    departure_at = pw.DateTimeField()
    arrival_at = pw.DateTimeField()
    distance = UnsignedSmallIntegerField()


class Order(Model):
    @enum.unique
    class State(enum.IntEnum):
        active = 0
        completed = 1

    class StateField(UnsignedSmallIntegerField):
        def db_value(self, value):
            return value.value

        def python_value(self, value):
            return Order.State(value)

    id = pw.PrimaryKeyField()
    user = pw.ForeignKeyField(User, backref='orders', on_delete='CASCADE')
    created_at = pw.DateTimeField()
    state = StateField()
    info = pw.CharField(max_length=128)


class Ticket(Model):
    @enum.unique
    class Type(enum.IntEnum):
        business = 0
        econom = 1

    class TypeField(UnsignedSmallIntegerField):
        def db_value(self, value):
            return value.value

        def python_value(self, value):
            return Ticket.Type(value)

    flight = pw.ForeignKeyField(Flight, backref='tickets', on_delete='CASCADE')
    seat = UnsignedSmallIntegerField()
    order = pw.ForeignKeyField(
        Order, null=True, backref='tickets', on_delete='SET NULL')
    type = TypeField()
    price = UnsignedSmallIntegerField()

    class Meta:
        primary_key = pw.CompositeKey('flight', 'seat')


class Payment(Model):
    order = pw.ForeignKeyField(
        Order, backref='payment', unique=True, on_delete='CASCADE')
    amount = UnsignedSmallIntegerField()


@click.group()
def db():
    pass


@db.command('init')
@with_appcontext
def init():
    database.create_tables(
        [User, BannedUser, Airport, Direction, Flight, Order, Ticket, Payment])
    click.echo('Initialized the database')
