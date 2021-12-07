from flask import Flask
import os


def create_app(test_config=None) -> Flask:
    app = Flask(__name__)

    if test_config is not None:
        # Load the test config if passed in
        app.config.from_mapping(test_config)
    elif app.config['ENV'] == 'development':
        # Load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # Load config from environment variables
        app.config['DATABASE'] = os.getenv('DATABASE')
        app.config['PAYMENT_SERVICE'] = os.getenv('PAYMENT_SERVICE')

    with app.app_context():
        # Initialize database
        from . import db
        app.cli.add_command(db.db)

        from . import views

    return app
