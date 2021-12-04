from flask import Flask
from flask_admin import Admin

def create_app(test_config=None) -> Flask:
    app = Flask(__name__)

    if test_config is None:
        # Load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # Load the test config if passed in
        app.config.from_mapping(test_config)

    admin = Admin(app, name="Airport admin", template_mode='bootstrap3')

    with app.app_context():
        # Add views
        from . import views
        from ..chief import db
        admin.add_view(views.UserView(db.User))
        admin.add_view(views.AirportView(db.Airport))
        admin.add_view(views.DirectionView(db.Direction))
        admin.add_view(views.FlightView(db.Flight))
        admin.add_view(views.OrderView(db.Order))
        admin.add_view(views.PaymentView(db.Payment))

    return app
