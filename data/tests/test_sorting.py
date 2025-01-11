# File: tests/test_sorting.py

def test_sorting_by_multiple_fields(client):
    """
    Test sorting studies by enrollment_count ascending and start_date descending.
    """
    params = {
        "sort_by": ["enrollment_count", "start_date"],
        "sort_order": ["asc", "desc"],
        "page_size": 5
    }
    response = client.get(
        "/api/sorted-studies/multiple-fields",
        params=params
    )
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    data = response.json()
    studies = data.get("studies", [])
    assert isinstance(studies, list)
    assert len(studies) > 0, "No studies returned in the response."

    # Verify sorting: enrollment_count ascending
    enrollment_counts = [study["enrollment_count"] for study in studies]
    assert enrollment_counts == sorted(enrollment_counts), "Enrollment counts are not sorted in ascending order."

    # Verify sorting: start_date descending
    start_dates = [study["start_date"] for study in studies if study.get("start_date")]
    start_dates_sorted_desc = sorted(start_dates, reverse=True)
    assert start_dates == start_dates_sorted_desc, "Start dates are not sorted in descending order."