# File: tests/test_data_transformation.py

import datetime

import pytest


def test_calculate_enrollment_rates(client):
    """
    Test the calculation of enrollment rates for studies.
    """
    response = client.get(
        "/api/enriched-studies/multi-conditions",
        params={"conditions": ["cancer"], "page_size": 5}
    )
    assert response.status_code == 200
    data = response.json()
    studies = data.get("studies", [])
    assert isinstance(studies, list)
    current_year = datetime.datetime.now().year
    for study in studies:
        enrollment_count = study.get("enrollment_count")
        start_date = study.get("start_date")
        if start_date and enrollment_count is not None:
            start_year = int(start_date.split("-")[0])
            duration = current_year - start_year
            expected_rate = enrollment_count / duration if duration > 0 else enrollment_count
            assert study.get("enrollment_rate") == expected_rate
        else:
            assert study.get("enrollment_rate") is None


def test_aggregate_conditions(client):
    """
    Test aggregation of studies by conditions.
    """
    response = client.get(
        "/api/enriched-studies/multi-conditions",
        params={"conditions": ["cancer"], "page_size": 10}
    )
    assert response.status_code == 200
    data = response.json()
    condition_counts = data.get("condition_counts", {})
    assert isinstance(condition_counts, dict)
    # Example: Ensure certain conditions are present
    # Replace "Condition1" with actual condition names expected
    expected_conditions = ["Condition1", "Condition2", "ConditionA"]
    for condition in expected_conditions:
        if condition in condition_counts:
            assert condition_counts[condition] >= 1
        else:
            pytest.fail(f"Expected condition '{condition}' not found in condition_counts.")

