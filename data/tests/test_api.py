# File: tests/test_api.py

import pytest
from fastapi.testclient import TestClient
from loguru import logger


def test_root(client):
    """
    Test the root endpoint to ensure it returns a welcome message.
    """
    logger.info("Testing root endpoint")
    response = client.get("/")
    logger.info(f"Response status code: {response.status_code}")
    assert response.status_code == 200
    json_response = response.json()
    logger.info(f"Response JSON: {json_response}")
    assert "message" in json_response
    assert "Hello from the Python backend with advanced features!" in json_response["message"]


def test_filtered_studies(client):
    """
    Basic check to ensure the /api/filtered-studies endpoint returns a 200 status code
    and includes expected keys in the JSON response.
    """
    logger.info("Testing /api/filtered-studies endpoint with condition=cancer and page_size=2")
    response = client.get("/api/filtered-studies/multi-conditions", params={"condition": "cancer", "page_size": 2})
    logger.info(f"Response status code: {response.status_code}")
    assert response.status_code == 200
    json_data = response.json()
    logger.info(f"Response JSON: {json_data}")
    assert "count" in json_data
    assert "studies" in json_data
    assert isinstance(json_data["studies"], list)


def test_get_study_details(client):
    """
    Test fetching details of a specific study by NCT ID.
    """
    nct_id = "NCT04000165"
    logger.info(f"Testing /api/studies/{nct_id} endpoint")
    response = client.get(f"/api/studies/{nct_id}")
    logger.info(f"Response status code: {response.status_code}")
    assert response.status_code == 200
    json_response = response.json()
    logger.info(f"Response JSON: {json_response}")
    assert "protocolSection" in json_response or "message" in json_response


def test_geo_stats(client):
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
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    json_data = response.json()
    logger.info(f"Response JSON: {json_data}")
    assert "totalStudies" in json_data
    assert "countryCounts" in json_data
    assert isinstance(json_data["countryCounts"], dict)


def test_time_stats(client):
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
    assert response.status_code == 200
    json_data = response.json()
    logger.info(f"Response JSON: {json_data}")
    assert "totalStudies" in json_data
    assert "yearBreakdown" in json_data
    assert isinstance(json_data["yearBreakdown"], dict)


def test_filtered_studies_with_advanced_filters(client):
    """
    Test the /api/filtered-studies endpoint with advanced filters.
    """
    params = {
        "condition": "heart disease",
        "search_term": "AREA[LastUpdatePostDate]RANGE[2023-01-15,MAX]",
        "page_size": 5,
        "overall_status": "RECRUITING",
        "only_with_results": True
    }
    logger.info(f"Testing /api/filtered-studies endpoint with advanced filters: {params}")
    response = client.get("/api/filtered-studies/multi-conditions", params=params)
    logger.info(f"Response status code: {response.status_code}")
    assert response.status_code == 200
    json_data = response.json()
    logger.info(f"Response JSON: {json_data}")
    assert "count" in json_data
    assert "studies" in json_data
    assert len(json_data["studies"]) <= 5
    for study in json_data["studies"]:
        assert study["overallStatus"] == "RECRUITING"
        assert study["hasResults"] is True