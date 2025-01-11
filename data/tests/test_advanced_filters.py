# File: tests/test_advanced_filters.py

def test_multi_condition_filtering(client):
    """
    Test filtering studies by multiple conditions.
    """
    response = client.get(
        "/api/filtered-studies/multi-conditions",
        params={"conditions": ["cancer", "diabetes"], "page_size": 5}
    )
    assert response.status_code == 200
    data = response.json()
    assert "studies" in data
    assert isinstance(data["studies"], list)
    for study in data["studies"]:
        assert any(cond in study["conditions"] for cond in ["cancer", "diabetes"])


def test_geospatial_filtering_bounding_box(client):
    """
    Test filtering studies within a geographical bounding box.
    """
    params = {
        "north": 40.0,
        "south": 35.0,
        "east": -70.0,
        "west": -80.0
    }
    response = client.get(
        "/api/filtered-studies/geo-bounds",
        params=params
    )
    assert response.status_code == 200
    data = response.json()
    assert "studies" in data
    assert isinstance(data["studies"], list)
    # Additional assertions based on expected data structure can be added here