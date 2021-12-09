from flask_basicauth import BasicAuth
from flask_admin import Admin
from flask import Flask
import os

def create_app(test_config=None) -> Flask:
    app = Flask(__name__)

    app.config['FLASK_ADMIN_SWATCH'] = 'cyborg'

    # We force authentication for whole site
    app.config['BASIC_AUTH_FORCE'] = True
    app.config['BASIC_AUTH_REALM'] = 'Airport administration pane'

    if test_config is not None:
        # Load the test config if passed in
        app.config.from_mapping(test_config)
    elif app.config['ENV'] == 'development':
        # Load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # Load config from environment variables
        app.config['DATABASE'] = os.getenv('DATABASE')
        app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
        app.config['BASIC_AUTH_USERNAME'] = os.getenv('BASIC_AUTH_USERNAME')
        app.config['BASIC_AUTH_PASSWORD'] = os.getenv('BASIC_AUTH_PASSWORD')

    auth = BasicAuth(app)
    admin = Admin(app, name="Airport admin", template_mode='bootstrap3')

    with app.app_context():
        # Initialize database
        from back.chief import db
        db.flask_db.init_app(app)

        # Add views
        from . import views
        for view in views.get_views():
            admin.add_view(view)

    return app
