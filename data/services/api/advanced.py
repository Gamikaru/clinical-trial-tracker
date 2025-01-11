# services/api/advanced.py

from fastapi import APIRouter, HTTPException
from typing import Optional, List

from services.service import (
    fetch_single_study,
    fetch_study_enums,
    fetch_search_areas,
    fetch_field_values,
    fetch_study_sizes,
    parse_participant_flow
)

router = APIRouter()

@router.get("/studies/{nct_id}")
def get_study_details(nct_id: str, fields: Optional[List[str]] = None):
    """
    Retrieve a single study by NCT ID, optionally specifying fields to return.

    e.g.  GET /api/studies/NCT04000165?fields=protocolSection,statusModule,resultsSection
    """
    try:
        data = fetch_single_study(nct_id, fields)
        if not data:
            return {"message": "No data returned"}
        return data
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@router.get("/study-results/participant-flow/{nct_id}")
def get_participant_flow(nct_id: str):
    """
    Example endpoint showing how to retrieve a single study's participant flow
    and parse it into a simpler funnel structure.
    """
    try:
        # We must request the "resultsSection" to parse participantFlow
        data = fetch_single_study(nct_id, fields=["resultsSection"])
        if not data.get("resultsSection"):
            return {"message": "No results section found for this study"}

        # parse funnel
        funnel = parse_participant_flow(data["resultsSection"])
        return {"funnel": funnel}

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@router.get("/enums")
def get_enums():
    """
    GET all enumerations from /studies/enums
    """
    try:
        enum_data = fetch_study_enums()
        return enum_data
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@router.get("/search-areas")
def get_search_areas():
    """
    GET all search areas from /studies/search-areas
    """
    try:
        areas = fetch_search_areas()
        return areas
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@router.get("/stats/size")
def get_stats_size():
    """
    GET study sizes from /stats/size
    """
    try:
        size_data = fetch_study_sizes()
        return size_data
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

@router.get("/stats/field/values")
def get_stats_field_values(
    fields: List[str],
    field_types: Optional[List[str]] = None
):
    """
    GET field values stats from /stats/field/values
    e.g. /api/stats/field/values?fields=Phase&field_types=ENUM
    """
    try:
        data = fetch_field_values(fields, field_types)
        return data
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# In services/api/advanced.py

@router.get("/geo-stats")
def get_geo_stats(
    condition: str,
    latitude: float,
    longitude: float,
    radius: str = "50mi",
    page_size: int = 100
):
    """
    Example endpoint to do an advanced geospatial aggregator:
    1. We fetch studies for a given condition within a radius of lat/long
    2. We group them by 'LocationCountry' or a relevant field.

    GET /api/geo-stats?condition=cancer&latitude=39.0035707&longitude=-77.1013313&radius=50mi
    """
    try:
        # build location_str param
        location_str = f"distance({latitude},{longitude},{radius})"
        raw_data = fetch_raw_data(
            condition=condition,
            location_str=location_str,
            page_size=page_size,
            fields=["NCTId", "BriefTitle", "protocolSection.contactsLocationsModule.locations"]
        )
        # Now parse and do custom grouping:
        studies = raw_data.get("studies", [])
        country_counts = {}

        for study in studies:
            contacts_mod = study.get("protocolSection", {}).get("contactsLocationsModule", {})
            locs = contacts_mod.get("locations", [])
            # each location can have a .country property
            for loc in locs:
                ctry = loc.get("country", "Unknown")
                country_counts[ctry] = country_counts.get(ctry, 0) + 1

        return {
            "totalStudies": len(studies),
            "countryCounts": country_counts
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

