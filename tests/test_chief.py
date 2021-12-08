from datetime import datetime
import os
import tempfile
import pytest
from back.chief import create_app


@pytest.fixture
def client():
    db_fd, db_path = tempfile.mkstemp()
    app = create_app({'TESTING': True, 'DATABASE': f"sqlite:///{db_path}"})

    with app.app_context():
        from back.chief.db import init, flask_db
        init()
        assert flask_db.database.close()
    yield app.test_client()

    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture
def populate():
    from back.chief import db

    u = db.User.create(id=0, auth_id="test", bonuses=100, info="")

    a = [db.Airport.create(name="Boryspil", city="Kyiv", info=""),
         db.Airport.create(name="Heathrow", city="London", info="")]
    d = [db.Direction.create(to=a[0]), db.Direction.create(to=a[1])]
    f = [db.Flight.create(id=0, direction=d[0], departure_at=datetime.now(),
                          arrival_at=datetime.now(), distance=1100),
         db.Flight.create(id=1, direction=d[1], departure_at=datetime.now(),
                          arrival_at=datetime.now(), distance=2300)
         ]

    t = [db.Ticket.create(flight=f[0], seat=30, price=200, type=db.Ticket.Type.econom),
         db.Ticket.create(flight=f[0], seat=40, price=350, type=db.Ticket.Type.business)]

    return f


def test_flights(client, populate):
    r = client.get("/flights")
    res = r.json

    assert res['flights'][0]['airport_name'] == 'Boryspil'
    assert res['flights'][1]['airport_name'] == 'Heathrow'


def test_flight_ids(client, populate):
    r = client.get("/flight_ids")
    res = r.json
    assert res == {'ids': [0, 1]}


def test_cities(client, populate):
    r = client.get('/cities')
    res = r.json
    assert res == {'cities': [{'city': 'Kyiv'}, {'city': 'London'}]}


def test_exact_flight(client, populate):
    for i, city in enumerate(['Kyiv', 'London']):
        r = client.get(f"/flights/{i}").json
        assert r['city'] == city


def test_available_tickets(client, populate):
    r = client.get(f"/flights/{0}/tickets")
    res = r.json
    assert res == {'business': [{'price': 350, 'seat': 40}], 'econom': [{'price': 200, 'seat': 30}]}


def test_my_info(client, populate):
    r = client.get("/account", headers={'Authorization': 'Bearer 0'})
    assert r.json == {
        "bonuses": 100,
        "user_id": 0
    }


def test_delete_me(client, populate):
    from back.chief import db

    assert len(list(db.User.select())) == 1

    r = client.delete("/account", headers={'Authorization': 'Bearer 0'})
    assert r.status_code == 200

    assert len(list(db.User.select())) == 0


def test_offline_booking(client, populate):
    r = client.post("/booking",
                    headers={'Authorization': 'Bearer 0'},
                    json={
                        "tickets": [{
                            "flight_id": 0,
                            "seat": 30
                        }],
                        "type": "offline",
                        "use_bonuses": 30,
                        "comment": ":D"
                    })
    assert r.status_code == 200
    assert r.json == {
        'comment': ':D',
        'order_id': 1,
        'tickets': [{
            'airport_name': 'Boryspil',
            'city': 'Kyiv',
            'price': 200,
            'seat': 30
        }]
    }
    from back.chief import db
    assert db.Order.get(db.Order.id == 1).user == db.User.get(db.User.id == 0)

    r = client.get("/order/1", headers={'Authorization': 'Bearer 0'})
    assert r.json["full_price"] == 200
    assert r.json["order_id"] == 1
    assert r.json["state"] == 0
