# File: services/api/advanced.py

from fastapi import APIRouter, HTTPException, Depends, Request
from typing import Optional, List
from services.service import (
    fetch_single_study,
    fetch_study_enums,
    fetch_search_areas,
    fetch_field_values,
    fetch_study_sizes,
    parse_participant_flow,
    check_rate_limit,
    fetch_raw_data
)
from services.models import GeoStatsQuery
from datetime import datetime
from pydantic import BaseModel
from loguru import logger

router = APIRouter()

@router.get("/studies/{nct_id}")
def get_study_details(
    nct_id: str,
    fields: Optional[List[str]] = None,
    request: Request = None  # to get client IP
):
    """
    Retrieve a single study by NCT ID, optionally specifying fields to return.
    """
    # Rate-limit check
    client_ip = request.client.host if request else "unknown"
    check_rate_limit(client_ip)

    try:
        data = fetch_single_study(nct_id, fields)
        if not data:
            logger.debug(f"get_study_details | No data returned for NCT ID={nct_id}")
            return {"message": "No data returned"}

        logger.debug(f"get_study_details | Retrieved data for NCT ID={nct_id}: {data}")
        return data
    except HTTPException as e:
        logger.error(f"get_study_details | HTTPException: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("get_study_details | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))

@router.get("/study-results/participant-flow/{nct_id}")
def get_participant_flow_endpoint(nct_id: str, request: Request = None):
    """
    Retrieve a single study's participant flow, parse it into funnel data.
    """
    client_ip = request.client.host if request else "unknown"
    check_rate_limit(client_ip)

    try:
        data = fetch_single_study(nct_id, fields=["protocolSection.resultsSection"])
        if not data.get("protocolSection", {}).get("resultsSection"):
            logger.debug(f"get_participant_flow_endpoint | No results section found for NCT ID={nct_id}")
            return {"message": "No results section found for this study"}

        funnel = parse_participant_flow(data["protocolSection"]["resultsSection"])
        logger.debug(f"get_participant_flow_endpoint | Parsed funnel data: {funnel}")
        return {"funnel": funnel}
    except HTTPException as e:
        logger.error(f"get_participant_flow_endpoint | HTTPException: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("get_participant_flow_endpoint | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))

@router.get("/enums")
def get_enums(request: Request = None):
    """
    Retrieve all study enumerations.
    """
    client_ip = request.client.host if request else "unknown"
    check_rate_limit(client_ip)

    try:
        enums = fetch_study_enums()
        logger.debug(f"get_enums | Retrieved enums: {enums}")
        return enums
    except HTTPException as e:
        logger.error(f"get_enums | HTTPException: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("get_enums | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))

@router.get("/search-areas")
def get_search_areas_endpoint(request: Request = None):
    """
    Retrieve all search areas.
    """
    client_ip = request.client.host if request else "unknown"
    check_rate_limit(client_ip)

    try:
        search_areas = fetch_search_areas()
        logger.debug(f"get_search_areas_endpoint | Retrieved search areas: {search_areas}")
        return search_areas
    except HTTPException as e:
        logger.error(f"get_search_areas_endpoint | HTTPException: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("get_search_areas_endpoint | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))

@router.get("/stats/size")
def get_stats_size(request: Request = None):
    """
    Retrieve study sizes statistics.
    """
    client_ip = request.client.host if request else "unknown"
    check_rate_limit(client_ip)

    try:
        study_sizes = fetch_study_sizes()
        logger.debug(f"get_stats_size | Retrieved study sizes: {study_sizes}")
        return study_sizes
    except HTTPException as e:
        logger.error(f"get_stats_size | HTTPException: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("get_stats_size | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))

@router.get("/stats/field/values")
def get_stats_field_values(
    fields: List[str],
    field_types: Optional[List[str]] = None,
    request: Request = None
):
    """
    Retrieve field values statistics.
    """
    client_ip = request.client.host if request else "unknown"
    check_rate_limit(client_ip)

    try:
        field_values = fetch_field_values(fields, field_types)
        logger.debug(f"get_stats_field_values | Retrieved field values: {field_values}")
        return field_values
    except HTTPException as e:
        logger.error(f"get_stats_field_values | HTTPException: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("get_stats_field_values | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))

@router.get("/geo-stats")
def get_geo_stats(
    query: GeoStatsQuery = Depends(),
    request: Request = None
):
    """
    Advanced geospatial aggregator using validated query params from Pydantic.
    """
    client_ip = request.client.host if request else "unknown"
    check_rate_limit(client_ip)

    try:
        # Construct the geo filter string based on latitude, longitude, and radius
        location_str = f"distance({query.latitude},{query.longitude},{query.radius})"
        raw_data = fetch_raw_data(
            condition=query.condition,
            location_str=location_str,
            page_size=query.page_size,
            fields=[
                "protocolSection.identificationModule.nctId",
                "protocolSection.identificationModule.briefTitle",
                "protocolSection.contactsLocationsModule.locations"
            ]
        )
        if raw_data is None:
            logger.error("get_geo_stats | fetch_raw_data returned None.")
            raise HTTPException(status_code=500, detail="Failed to fetch raw data.")

        studies = raw_data.get("studies", [])
        country_counts = {}

        for study in studies:
            contacts_mod = study.get("protocolSection", {}).get("contactsLocationsModule", {})
            locs = contacts_mod.get("locations", [])
            for loc in locs:
                country = loc.get("country", "Unknown")
                country_counts[country] = country_counts.get(country, 0) + 1

        logger.debug(f"get_geo_stats | Total studies: {len(studies)}, Country counts: {country_counts}")

        return {
            "totalStudies": len(studies),
            "countryCounts": country_counts
        }
    except HTTPException as e:
        logger.error(f"get_geo_stats | HTTPException: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("get_geo_stats | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))

@router.get("/time-stats")
def get_time_stats(
    condition: str,
    start_year: int = 2020,
    request: Request = None
):
    """
    Aggregator to show how many studies were updated or started each year after 'start_year'.
    """
    client_ip = request.client.host if request else "unknown"
    check_rate_limit(client_ip)

    try:
        # Construct the advanced filter string for date range
        time_filter = f"AREA[LastUpdatePostDate]RANGE[{start_year}-01-01,MAX]"
        raw_data = fetch_raw_data(
            condition=condition,
            advanced_filter=time_filter,
            page_size=100,  # Adjust as needed
            fields=["protocolSection.identificationModule.nctId", "protocolSection.statusModule.lastUpdatePostDateStruct.date"]
        )
        studies = raw_data.get("studies", [])
        year_counts = {}

        for study in studies:
            status_mod = study.get("protocolSection", {}).get("statusModule", {})
            last_update_struct = status_mod.get("lastUpdatePostDateStruct", {})
            date_str = last_update_struct.get("date", None)
            if date_str:
                # Extract year from date string, e.g., "2023-05-10" -> "2023"
                year = date_str.split("-")[0]
                year_counts[year] = year_counts.get(year, 0) + 1

        logger.debug(f"time_stats | Total studies: {len(studies)}, Year breakdown: {year_counts}")

        return {
            "totalStudies": len(studies),
            "yearBreakdown": year_counts
        }
    except HTTPException as e:
        logger.error(f"get_time_stats | HTTPException: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("get_time_stats | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))


# filepath: /path/to/services/api/advanced.py
@router.get("/enrollment-insights")
def get_enrollment_insights(request: Request):
    client_ip = request.client.host
    check_rate_limit(client_ip)

    raw_data = fetch_raw_data(condition="cancer", page_size=100)
    cleaned_data = clean_and_transform_data(raw_data)
    insights = analyze_enrollment_data(cleaned_data)

    return insights