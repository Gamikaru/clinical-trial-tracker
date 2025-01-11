# File: tests/test_api.py

import pytest
from main import app  # Import the FastAPI app
from fastapi.testclient import TestClient
from loguru import logger

# Configure loguru
logger.add("test_api.log", rotation="500 MB")

client = TestClient(app)  # Initialize the TestClient with the FastAPI app

def test_root():
    """
    Test the root endpoint to ensure it returns a welcome message.
    """
    logger.info("Testing root endpoint")
    response = client.get("/")
    logger.info(f"Response status code: {response.status_code}")
    logger.info(f"Response JSON: {response.json()}")
    assert response.status_code == 200
    assert "Hello from the Python backend with advanced features!" in response.json()["message"]

def test_filtered_studies():
    """
    Basic check to ensure the /api/filtered-studies endpoint returns a 200 status code
    and includes expected keys in the JSON response.
    """
    logger.info("Testing /api/filtered-studies endpoint with condition=cancer and page_size=2")
    response = client.get("/api/filtered-studies?condition=cancer&page_size=2")
    logger.info(f"Response status code: {response.status_code}")
    logger.info(f"Response JSON: {response.json()}")
    assert response.status_code == 200
    json_data = response.json()
    assert "count" in json_data
    assert "studies" in json_data
    assert isinstance(json_data["studies"], list)

# File: tests/test_api.py

def test_get_study_details():
    """
    Test fetching details of a specific study by NCT ID.
    """
    nct_id = "NCT04000165"
    logger.info(f"Testing /api/studies/{nct_id} endpoint")  # Updated log message
    response = client.get(f"/api/studies/{nct_id}")        # Updated endpoint path
    logger.info(f"Response status code: {response.status_code}")
    logger.info(f"Response JSON: {response.json()}")
    assert response.status_code == 200
    data = response.json()
    assert "protocolSection" in data or "message" in data

def test_geo_stats():
    """
    Test the /api/geo-stats endpoint with valid query parameters.
    """
    params = {
        "condition": "cancer",
        "latitude": 39.00357,
        "longitude": -77.10133,
        "radius": "50mi",
        "page_size": 10
    }
    logger.info(f"Testing /api/geo-stats endpoint with params: {params}")
    response = client.get("/api/geo-stats", params=params)
    logger.info(f"Response status code: {response.status_code}")
    logger.info(f"Response JSON: {response.json()}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    json_data = response.json()
    assert "totalStudies" in json_data
    assert "countryCounts" in json_data
    assert isinstance(json_data["countryCounts"], dict)

def test_time_stats():
    """
    Test the /api/time-stats endpoint with valid query parameters.
    """
    params = {
        "condition": "cancer",
        "start_year": 2020
    }
    logger.info(f"Testing /api/time-stats endpoint with params: {params}")
    response = client.get("/api/time-stats", params=params)
    logger.info(f"Response status code: {response.status_code}")
    logger.info(f"Response JSON: {response.json()}")
    assert response.status_code == 200
    json_data = response.json()
    assert "totalStudies" in json_data
    assert "yearBreakdown" in json_data
    assert isinstance(json_data["yearBreakdown"], dict)

def test_filtered_studies_with_advanced_filters():
    params = {
        "condition": "heart disease",
        "search_term": "AREA[LastUpdatePostDate]RANGE[2023-01-15,MAX]",
        "page_size": 5,
        "overall_status": "RECRUITING",
        "only_with_results": True
    }
    logger.info(f"Testing /api/filtered-studies endpoint with advanced filters: {params}")
    response = client.get("/api/filtered-studies", params=params)
    logger.info(f"Response status code: {response.status_code}")
    logger.info(f"Response JSON: {response.json()}")
    assert response.status_code == 200
    json_data = response.json()
    assert "count" in json_data
    assert "studies" in json_data
    assert len(json_data["studies"]) <= 5
    for study in json_data["studies"]:
        assert study["overallStatus"] == "RECRUITING"
        assert study["hasResults"] is True
