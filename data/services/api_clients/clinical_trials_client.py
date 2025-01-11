# data.services.api_clients.clinical_trials_client

import requests
import requests_cache
from typing import List, Dict, Any, Optional
from loguru import logger
from fastapi import HTTPException
from ..utils.error_handling import _handle_errors


# Enable in-memory caching with a 5-minute expiration
requests_cache.install_cache(
    cache_name='clinical_trials_cache',
    backend='memory',
    expire_after=60*5  # 5 minutes
)

API_BASE_URL = "https://clinicaltrials.gov/api/v2"

@logger.catch
def fetch_raw_data(
    condition: str = "cancer",
    page_size: int = 10,
    page_token: Optional[str] = None,
    overall_status: Optional[List[str]] = None,
    search_term: Optional[str] = None,
    location_str: Optional[str] = None,
    advanced_filter: Optional[str] = None,
    fields: Optional[List[str]] = None,
    sort: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    Fetch raw study data from ClinicalTrials.gov v2 API with advanced query & filter support.
    Utilizes caching to minimize redundant requests.
    """
    params = {
        "format": "json",
        "pageSize": page_size,
        "query.cond": condition,
    }

    if search_term:
        params["query.term"] = search_term

    if page_token:
        params["pageToken"] = page_token

    if overall_status:
        params["filter.overallStatus"] = ",".join(overall_status)

    if location_str:
        params["filter.geo"] = location_str

    if advanced_filter:
        params["filter.advanced"] = advanced_filter

    if fields and len(fields) > 0:
        params["fields"] = ",".join(fields)

    if sort:
        params["sort"] = ",".join(sort)

    logger.debug(f"fetch_raw_data | GET {API_BASE_URL}/studies with params={params}")

    try:
        response = requests.get(f"{API_BASE_URL}/studies", params=params, timeout=30)
        _handle_errors(response)
        data = response.json()
        logger.debug(f"fetch_raw_data | Retrieved {len(data.get('studies', []))} studies.")
        return data
    except requests.RequestException:
        logger.exception("[ERROR fetch_raw_data] Unhandled request exception.")
        raise HTTPException(status_code=500, detail="Failed to fetch raw data.")

@logger.catch
def fetch_single_study(nct_id: str, fields: Optional[List[str]] = None) -> Dict[str, Any]:
    """
    Fetch details for a single study by NCT ID from the v2 API.
    """
    params = {"format": "json"}
    if fields and len(fields) > 0:
        params["fields"] = ",".join(fields)

    url = f"{API_BASE_URL}/studies/{nct_id}"
    logger.debug(f"fetch_single_study | GET {url} with params={params}")

    try:
        response = requests.get(url, params=params, timeout=30)
        _handle_errors(response)
        data = response.json()
        logger.debug(f"fetch_single_study | Retrieved data for NCT ID={nct_id}")
        return data
    except requests.RequestException:
        logger.exception("[ERROR fetch_single_study] Unhandled request exception.")
        raise HTTPException(status_code=500, detail="Failed to fetch single study.")

@logger.catch
def fetch_study_enums() -> List[Dict[str, Any]]:
    """
    Fetch all enumerations from the v2 API.
    """
    url = f"{API_BASE_URL}/studies/enums"
    logger.debug(f"fetch_study_enums | GET {url}")

    try:
        response = requests.get(url, timeout=30)
        _handle_errors(response)
        data = response.json()
        logger.debug(f"fetch_study_enums | Retrieved {len(data)} enums.")
        return data
    except requests.RequestException:
        logger.exception("[ERROR fetch_study_enums] Unhandled request exception.")
        raise HTTPException(status_code=500, detail="Failed to fetch study enums.")

@logger.catch
def fetch_search_areas() -> List[Dict[str, Any]]:
    """
    Fetch all search areas from the v2 API.
    """
    url = f"{API_BASE_URL}/studies/search-areas"
    logger.debug(f"fetch_search_areas | GET {url}")

    try:
        response = requests.get(url, timeout=30)
        _handle_errors(response)
        data = response.json()
        logger.debug(f"fetch_search_areas | Retrieved {len(data)} search areas.")
        return data
    except requests.RequestException:
        logger.exception("[ERROR fetch_search_areas] Unhandled request exception.")
        raise HTTPException(status_code=500, detail="Failed to fetch search areas.")

@logger.catch
def fetch_field_values(fields: List[str], field_types: Optional[List[str]] = None) -> List[Dict[str, Any]]:
    """
    Fetch field values statistics from the v2 API.
    """
    url = f"{API_BASE_URL}/stats/field/values"
    params = {"fields": ",".join(fields)}

    if field_types:
        params["types"] = ",".join(field_types)

    logger.debug(f"fetch_field_values | GET {url} with params={params}")

    try:
        response = requests.get(url, params=params, timeout=30)
        _handle_errors(response)
        data = response.json()
        logger.debug(f"fetch_field_values | Retrieved field values for fields: {fields}")
        return data
    except requests.RequestException:
        logger.exception("[ERROR fetch_field_values] Unhandled request exception.")
        raise HTTPException(status_code=500, detail="Failed to fetch field values.")

@logger.catch
def fetch_study_sizes() -> Dict[str, Any]:
    """
    Fetch study sizes statistics from the v2 API.
    """
    url = f"{API_BASE_URL}/stats/size"
    logger.debug(f"fetch_study_sizes | GET {url}")

    try:
        response = requests.get(url, timeout=30)
        _handle_errors(response)
        data = response.json()
        logger.debug("fetch_study_sizes | Retrieved study sizes statistics.")
        return data
    except requests.RequestException:
        logger.exception("[ERROR fetch_study_sizes] Unhandled request exception.")
        raise HTTPException(status_code=500, detail="Failed to fetch study sizes.")