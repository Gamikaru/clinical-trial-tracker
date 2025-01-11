# File: services/service.py

import requests
import requests_cache
from typing import List, Dict, Any, Optional, Tuple
from loguru import logger
import time
from fastapi import HTTPException
import pandas as pd

# Rate-limit configuration
MAX_TOKENS = 50        # Maximum number of requests allowed
REFILL_RATE = 0.1      # Tokens refilled per second (0.1 = 1 token every 10 seconds)
rate_limit_store = {}  # In-memory store: {client_ip: (tokens, last_timestamp)}

# Enable in-memory caching with a 5-minute expiration
requests_cache.install_cache(
    cache_name='clinical_trials_cache',
    backend='memory',
    expire_after=60*5  # 5 minutes
)

API_BASE_URL = "https://clinicaltrials.gov/api/v2"

def _handle_errors(response: requests.Response):
    """
    Raises HTTPException if the response contains an HTTP error status.
    Logs the error details.
    """
    try:
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        logger.error(f"Request failed with status {response.status_code}: {response.text}")
        raise HTTPException(
            status_code=response.status_code,
            detail=f"Error from upstream API: {response.text}"
        ) from e

def check_rate_limit(client_ip: str):
    """
    Implements a simple token-bucket rate limiting algorithm.
    Raises HTTPException if the client has exceeded the rate limit.
    """
    now = time.time()
    tokens, last_ts = rate_limit_store.get(client_ip, (MAX_TOKENS, now))

    # Refill tokens based on elapsed time
    elapsed = now - last_ts
    refill_amount = elapsed * REFILL_RATE
    tokens = min(MAX_TOKENS, tokens + refill_amount)

    if tokens < 1:
        # No tokens available; rate limit exceeded
        logger.warning(f"Rate limit reached for IP={client_ip}")
        raise HTTPException(status_code=429, detail="Too Many Requests. Please slow down.")

    # Use 1 token
    tokens -= 1
    rate_limit_store[client_ip] = (tokens, now)

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

@logger.catch
def clean_and_transform_data(raw_json: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Cleans and transforms raw JSON data into a list of dictionaries with relevant fields.
    """
    if "studies" not in raw_json:
        logger.debug("clean_and_transform_data | No studies found in raw_json.")
        return []

    cleaned_data = []
    for study in raw_json["studies"]:
        protocol_section = study.get("protocolSection", {})
        identification_module = protocol_section.get("identificationModule", {})
        status_module = protocol_section.get("statusModule", {})
        design_module = protocol_section.get("designModule", {})
        conditions_module = protocol_section.get("conditionsModule", {})

        nct_id = identification_module.get("nctId", "N/A")
        brief_title = identification_module.get("briefTitle", "No Title")
        overall_status = status_module.get("overallStatus", "Unknown")
        has_results = study.get("hasResults", False)

        enrollment_info = design_module.get("enrollmentInfo", {})
        enrollment_count = enrollment_info.get("count", None)  # Changed to "enrollment_count"

        start_date_struct = status_module.get("startDateStruct", {})
        start_date = start_date_struct.get("date")

        conditions = conditions_module.get("conditions", [])

        if nct_id == "N/A" or brief_title == "No Title":
            logger.debug(f"clean_and_transform_data | Skipping study with nctId={nct_id}")
            continue

        cleaned_record = {
            "nctId": nct_id,
            "briefTitle": brief_title,
            "overallStatus": overall_status,
            "hasResults": has_results,
            "enrollment_count": enrollment_count,  # Standardized key
            "start_date": start_date,               # Consistent key naming
            "conditions": conditions
        }

        cleaned_data.append(cleaned_record)

    logger.debug(f"clean_and_transform_data | Returning {len(cleaned_data)} items.")
    logger.info(f"clean_and_transform_data | Cleaned data: {cleaned_data}")
    return cleaned_data

@logger.catch
def parse_participant_flow(results_section: Dict[str, Any]) -> Dict[str, Any]:
    """
    Parses the participant flow data from the results section.
    """
    flow_module = results_section.get("participantFlowModule", {})
    if not flow_module:
        logger.debug("parse_participant_flow | No participantFlowModule found.")
        return {}

    periods = flow_module.get("periods", [])
    total_started, total_completed, total_dropped, drop_reasons = parse_periods(periods)

    funnel_data = {
        "totalStarted": total_started,
        "totalCompleted": total_completed,
        "totalDropped": total_dropped,
        "dropReasons": drop_reasons
    }

    logger.debug(f"parse_participant_flow | Parsed participant flow: {funnel_data}")
    return funnel_data

def parse_periods(periods: List[Dict[str, Any]]) -> Tuple[int, int, int, Dict[str, int]]:
    """
    Parses periods to calculate totals for started, completed, and dropped participants.
    """
    total_started = 0
    total_completed = 0
    total_dropped = 0
    drop_reasons = {}

    for period in periods:
        started, completed = parse_milestones(period.get("milestones", []))
        total_started += started
        total_completed += completed

        dropped, reasons = parse_drop_withdraws(period.get("dropWithdraws", []))
        total_dropped += dropped
        for reason, count in reasons.items():
            drop_reasons[reason] = drop_reasons.get(reason, 0) + count

    return total_started, total_completed, total_dropped, drop_reasons

def parse_milestones(milestones: List[Dict[str, Any]]) -> Tuple[int, int]:
    """
    Parses milestones to calculate started and completed participants.
    """
    total_started = 0
    total_completed = 0

    for milestone in milestones:
        for achievement in milestone.get("achievements", []):
            num_val = parse_num_subjects(achievement.get("flowAchievementNumSubjects", "0"))
            milestone_type = milestone.get("type", "").upper()
            if milestone_type == "STARTED":
                total_started += num_val
            elif milestone_type == "COMPLETED":
                total_completed += num_val

    return total_started, total_completed

def parse_drop_withdraws(drop_withdraws: List[Dict[str, Any]]) -> Tuple[int, Dict[str, int]]:
    """
    Parses dropWithdraws to calculate total dropped participants and reasons.
    """
    total_dropped = 0
    drop_reasons = {}

    for drop_withdraw in drop_withdraws:
        reason_type = drop_withdraw.get("type", "Unknown")
        reasons = drop_withdraw.get("reasons", [])
        reason_sum = sum(parse_num_subjects(reason.get("numSubjects", "0")) for reason in reasons)
        total_dropped += reason_sum
        drop_reasons[reason_type] = drop_reasons.get(reason_type, 0) + reason_sum

    return total_dropped, drop_reasons

def parse_num_subjects(num_str: str) -> int:
    """
    Parses the number of subjects from a string. Returns 0 if parsing fails.
    """
    try:
        return int(num_str)
    except ValueError:
        logger.warning(f"parse_num_subjects | Invalid number of subjects: {num_str}")
        return 0



def analyze_enrollment_data(cleaned_data: List[Dict[str, Any]]) -> Dict[str, Any]:
    df = pd.DataFrame(cleaned_data)
    enrollment_stats = {
        "average_enrollment": df['enrollment_count'].mean(),
        "total_enrollment": df['enrollment_count'].sum(),
        "enrollment_distribution": df['enrollment_count'].value_counts().to_dict()
    }
    return enrollment_stats