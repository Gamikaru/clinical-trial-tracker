# data.services.service

from typing import List, Dict, Any, Optional
from loguru import logger
from fastapi import HTTPException, Request
from .utils.rate_limiting import check_rate_limit
from .api_clients.clinical_trials_client import (
    fetch_raw_data,
    fetch_single_study,
    fetch_study_enums,
    fetch_search_areas,
    fetch_field_values,
    fetch_study_sizes
)
from .data_processing.data_cleaning import clean_and_transform_data
from .data_processing.participant_flow import parse_participant_flow
from .analysis.enrollment_analysis import (
    analyze_enrollment_data,
    calculate_enrollment_rates,
    aggregate_conditions
)

@logger.catch
def get_study_details(nct_id: str, fields: Optional[List[str]] = None, request: Optional[Request] = None) -> Dict[str, Any]:
    """
    Retrieve details of a single study by NCT ID.
    """
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

@logger.catch
def get_enums(request: Optional[Request] = None) -> List[Dict[str, Any]]:
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

@logger.catch
def get_search_areas(request: Optional[Request] = None) -> List[Dict[str, Any]]:
    """
    Retrieve all search areas.
    """
    client_ip = request.client.host if request else "unknown"
    check_rate_limit(client_ip)

    try:
        search_areas = fetch_search_areas()
        logger.debug(f"get_search_areas | Retrieved search areas: {search_areas}")
        return search_areas
    except HTTPException as e:
        logger.error(f"get_search_areas | HTTPException: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("get_search_areas | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))

@logger.catch
def get_field_values(fields: List[str], field_types: Optional[List[str]] = None) -> List[Dict[str, Any]]:
    """
    Retrieve field values statistics.
    """
    try:
        field_values = fetch_field_values(fields, field_types)
        logger.debug(f"get_field_values | Retrieved field values: {field_values}")
        return field_values
    except HTTPException as e:
        logger.error(f"get_field_values | HTTPException: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("get_field_values | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))

@logger.catch
def get_study_sizes() -> Dict[str, Any]:
    """
    Retrieve study sizes statistics.
    """
    try:
        study_sizes = fetch_study_sizes()
        logger.debug(f"get_study_sizes | Retrieved study sizes: {study_sizes}")
        return study_sizes
    except HTTPException as e:
        logger.error(f"get_study_sizes | HTTPException: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("get_study_sizes | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))

@logger.catch
def handle_participant_flow(results_section: Dict[str, Any]) -> Dict[str, Any]:
    """
    Handle parsing of participant flow data.
    """
    try:
        funnel = parse_participant_flow(results_section)
        logger.debug(f"handle_participant_flow | Parsed funnel data: {funnel}")
        return funnel
    except HTTPException as e:
        logger.error(f"handle_participant_flow | HTTPException: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("handle_participant_flow | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))

@logger.catch
def process_enrollment_data(cleaned_data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyze enrollment data from cleaned study data.
    """
    try:
        enrollment_stats = analyze_enrollment_data(cleaned_data)
        logger.debug(f"process_enrollment_data | Enrollment stats: {enrollment_stats}")
        return enrollment_stats
    except Exception as exc:
        logger.exception("process_enrollment_data | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))

@logger.catch
def enrich_study_data(cleaned_data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Enrich study data with enrollment rates and condition aggregation.
    """
    try:
        enriched_data = calculate_enrollment_rates(cleaned_data)
        condition_counts = aggregate_conditions(enriched_data)
        logger.debug(f"enrich_study_data | Enriched data: {enriched_data}")
        logger.debug(f"enrich_study_data | Condition counts: {condition_counts}")
        return {
            "enrichedData": enriched_data,
            "conditionCounts": condition_counts
        }
    except Exception as exc:
        logger.exception("enrich_study_data | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))