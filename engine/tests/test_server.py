import pytest
from fastapi.testclient import TestClient

import server
from fleet_engine import Location


class FakeGeocoder:
    KNOWN = {
        "Kitsilano": (49.2634, -123.1541),
        "Point Grey": (49.2644, -123.1953),
        "Coquitlam": (49.2771, -122.7986),
    }

    def locate(self, address):
        point = self.KNOWN.get(address)
        return Location(point[0], point[1], address) if point else None


@pytest.fixture
def client(monkeypatch):
    monkeypatch.setattr(server, "GEOCODER", FakeGeocoder())
    monkeypatch.setattr(server, "SERVER_SECRET", None)
    return TestClient(server.app)


BODY = {
    "rows": {
        "service_orders": [
            {"id": "s1", "order_number": 101, "address": "Kitsilano", "service_time": "10:00:00",
             "load_size": "1/4 Truck", "status": "confirmed"},
            {"id": "s2", "order_number": 102, "address": "Coquitlam", "service_time": "14:00:00",
             "load_size": "1/8 Truck", "status": "pending"},
        ],
    },
    "address": "Point Grey",
    "preferredTime": "18:00",
    "loadSize": "1/4 Truck",
}


def test_quote_offers_the_slot_next_to_the_booked_job(client):
    reply = client.post("/quote", json=BODY)
    assert reply.status_code == 200
    data = reply.json()
    assert data["tier"] == "1/4 Truck" and data["basePrice"] == 260
    assert data["pickedFits"]
    assert len(data["slots"]) == 8
    assert data["offers"], data["slots"]
    best = data["offers"][0]
    assert best["price"] < 260
    assert best["message"].startswith("Would you like to move your pickup")
    assert {"start", "end", "price", "discount", "message"} <= set(best)


def test_unknown_address_is_rejected(client):
    reply = client.post("/quote", json={**BODY, "address": "Nowhere Rd"})
    assert reply.status_code == 422
    assert "locate" in reply.json()["detail"]


def test_load_size_or_volume_is_needed(client):
    body = {k: v for k, v in BODY.items() if k != "loadSize"}
    assert client.post("/quote", json=body).status_code == 422


def test_secret_is_required_when_set(client, monkeypatch):
    monkeypatch.setattr(server, "SERVER_SECRET", "s3cret")
    assert client.post("/quote", json=BODY).status_code == 401
    assert client.post("/quote", json=BODY, headers={"X-Engine-Secret": "s3cret"}).status_code == 200
    assert client.get("/health").status_code == 200
