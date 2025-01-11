# tests/test_api.py

import pytest
from data.main import app  # Updated import

from fastapi.testclient import TestClient

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Hello from the Python backend!" in response.json()["message"]

def test_filtered_studies():
    # basic check we get a 200, not necessarily real data
    response = client.get("/api/filtered-studies?condition=cancer&page_size=2")
    assert response.status_code == 200
    json_data = response.json()
    assert "count" in json_data
    assert "studies" in json_data

def test_get_study_details():
    # NCT04000165 is a known valid NCT ID
    response = client.get("/api/studies/NCT04000165")
    assert response.status_code == 200
    # The response might be large, we just verify some basic structure
    data = response.json()
    # checks for protocolSection or something
    assert "protocolSection" in data or "message" in data

