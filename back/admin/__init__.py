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
        for view in views.get_views():
            admin.add_view(view)

    return app
