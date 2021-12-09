from playhouse.db_url import connect
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
        app.config['GOTRUE_URL'] = os.getenv('GOTRUE_URL')

    with app.app_context():
        # Initialize database
        from . import db
        app.cli.add_command(db.db)

        if not app.testing:
            db.flask_db.init_app(app)
        else:
            db.flask_db.database.initialize(connect(app.config['DATABASE']))

        from . import views

    return app
