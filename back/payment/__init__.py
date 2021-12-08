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
        app.config['SITE_URL'] = os.getenv('SITE_URL')
        app.config['STRIPE_API_KEY'] = os.getenv('STRIPE_API_KEY')
        app.config['STRIPE_WEBHOOK_SECRET'] = os.getenv('STRIPE_WEBHOOK_SECRET')
        app.config['CHIEF_URL'] = os.getenv('CHIEF_URL')

    with app.app_context():
        from . import views

    return app
