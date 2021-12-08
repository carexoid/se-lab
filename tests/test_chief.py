from datetime import datetime
import os
import tempfile
import pytest
from contextlib import contextmanager

from back.chief import create_app


@pytest.fixture
def client():
    db_fd, db_path = tempfile.mkstemp()
    app = create_app({'TESTING': True, 'DATABASE': f"sqlite:///{db_path}"})

    with app.test_client() as client:
        with app.app_context():
            from back.chief.db import init, flask_db
            init()
            assert flask_db.database.close()
        yield client

    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture
def populate():
    from back.chief import db

    u = db.User.create(auth_id="test", bonuses=100, info="")

    a = [db.Airport.create(name="Boryspil", city="Kyiv", info=""),
         db.Airport.create(name="Heathrow", city="London", info="")]
    d = [db.Direction.create(to=a[0]), db.Direction.create(to=a[1])]
    f = [db.Flight.create(direction=d[0], departure_at=datetime.now(),
                          arrival_at=datetime.now(), distance=1100),
         db.Flight.create(direction=d[1], departure_at=datetime.now(),
                          arrival_at=datetime.now(), distance=2300)
         ]
    return f


def test_flights(client, populate):

    r = client.get("/flights")

    assert True
