from flask import Flask


def create_app(test_config=None) -> Flask:
    app = Flask(__name__)

    if test_config is None:
        # Load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # Load the test config if passed in
        app.config.from_mapping(test_config)

    with app.app_context():
        # Initialize database
        from . import db
        app.cli.add_command(db.db)

    return app
