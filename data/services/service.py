# services/service.py

import requests
import requests_cache  # new
from typing import List, Dict, Any, Optional

# Enable requests-cache globally
# We create an in-memory cache named 'clinical_trials_cache'
requests_cache.install_cache(cache_name='clinical_trials_cache', backend='memory', expire_after=60*5)
# ^ expire_after=60*5 => 5 minutes caching

API_BASE_URL = "https://clinicaltrials.gov/api/v2"

# -----------------------------------------------------------------------------
# Extended Query Options
# -----------------------------------------------------------------------------

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
    Fetch raw study data from ClinicalTrials.gov v2 API, with advanced query & filter support.

    By default, we only do: query.cond=cancer, format=json, pageSize=10.
    You can pass in additional parameters for advanced searching:
      - search_term -> query.term
      - overall_status -> filter.overallStatus
      - location_str -> filter.geo (like 'distance(lat,lon,radius)')
      - advanced_filter -> filter.advanced
      - fields -> array of fields to retrieve from the JSON
      - sort -> array of sorting expressions, e.g. ["LastUpdatePostDate", "EnrollmentCount:desc"]

    The returned JSON includes "studies" array, "nextPageToken", etc.
    """
    # Basic required params
    params = {
        "format": "json",
        "pageSize": page_size,
        "query.cond": condition,  # e.g., "heart disease"
    }

    # Conditionally add advanced queries
    if search_term:
        params["query.term"] = search_term

    if page_token:
        params["pageToken"] = page_token

    # If user wants to filter by recruitment status
    # e.g. overall_status=["RECRUITING","COMPLETED"]
    if overall_status:
        # The API allows multiple status values
        # We can pass them as repeated filter.overallStatus= ??? in a single request
        # But in GET requests, we can also just separate them with commas:
        params["filter.overallStatus"] = ",".join(overall_status)

    if location_str:
        # e.g. 'distance(39.0035707,-77.1013313,50mi)'
        # The official docs say we can do: filter.geo=distance(...)
        params["filter.geo"] = location_str

    if advanced_filter:
        # e.g. 'AREA[StartDate]2022'
        params["filter.advanced"] = advanced_filter

    # If user wants certain fields only
    # e.g. fields=["NCTId","BriefTitle","HasResults"]
    if fields and len(fields) > 0:
        params["fields"] = ",".join(fields)

    # Sorting, e.g. sort=["@relevance","LastUpdatePostDate:desc"]
    # The docs say we can pass multiple sort parameters.
    if sort:
        # We can pass them as repeated &sort= in the URL or as a single comma-separated
        # According to the doc, a list is acceptable with multiple query param values.
        # We'll just comma-separate them:
        params["sort"] = ",".join(sort)

    # Debug
    print(f"[DEBUG fetch_raw_data] GET {API_BASE_URL}/studies with params:", params)

    try:
        response = requests.get(f"{API_BASE_URL}/studies", params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
        return data
    except requests.exceptions.RequestException as err:
        print("[ERROR fetch_raw_data]", err)
        raise

# -----------------------------------------------------------------------------
# Single Study
# -----------------------------------------------------------------------------

def fetch_single_study(nct_id: str, fields: Optional[List[str]] = None) -> Dict[str, Any]:
    """
    Fetch details for a single study by NCT ID from the v2 API.
    :param nct_id: e.g. "NCT01234567"
    :param fields: optional list of fields to retrieve (e.g. "resultsSection")
    :return: The JSON dictionary representing the single study.
    """
    params = {
        "format": "json",
    }

    if fields and len(fields) > 0:
        params["fields"] = ",".join(fields)

    url = f"{API_BASE_URL}/studies/{nct_id}"
    print(f"[DEBUG fetch_single_study] GET {url} with params:", params)

    try:
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as err:
        print("[ERROR fetch_single_study]", err)
        raise

# -----------------------------------------------------------------------------
# Additional Endpoints (Enums, Search Areas, Stats)
# -----------------------------------------------------------------------------

def fetch_study_enums() -> List[Dict[str, Any]]:
    """
    GET /studies/enums
    Returns an array of enum types and their possible values.
    Example usage: to see all possible "Phase" or "OverallStatus" enumerations.
    """
    url = f"{API_BASE_URL}/studies/enums"
    print(f"[DEBUG fetch_study_enums] GET {url}")
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as err:
        print("[ERROR fetch_study_enums]", err)
        raise

def fetch_search_areas() -> List[Dict[str, Any]]:
    """
    GET /studies/search-areas
    Returns search doc areas, with param, name, etc.
    """
    url = f"{API_BASE_URL}/studies/search-areas"
    print(f"[DEBUG fetch_search_areas] GET {url}")
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as err:
        print("[ERROR fetch_search_areas]", err)
        raise

def fetch_field_values(fields: List[str], field_types: Optional[List[str]] = None) -> List[Dict[str, Any]]:
    """
    GET /stats/field/values
    Return top values, missingStudyCount, etc. for certain fields.

    :param fields: list of piece names or field paths, e.g. ["Condition","InterventionName"]
    :param field_types: optional list of types like ["ENUM","BOOLEAN"].
    """
    url = f"{API_BASE_URL}/stats/field/values"
    params = {}
    # param "fields" can be repeated or comma-separated
    # We'll do comma-separated:
    params["fields"] = ",".join(fields)

    if field_types:
        # Also comma-separate
        params["types"] = ",".join(field_types)

    print(f"[DEBUG fetch_field_values] GET {url} params:", params)
    try:
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as err:
        print("[ERROR fetch_field_values]", err)
        raise

def fetch_study_sizes() -> Dict[str, Any]:
    """
    GET /stats/size
    Returns study JSON size statistics, including average, largestStudies, etc.
    """
    url = f"{API_BASE_URL}/stats/size"
    print(f"[DEBUG fetch_study_sizes] GET {url}")
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as err:
        print("[ERROR fetch_study_sizes]", err)
        raise

# -----------------------------------------------------------------------------
# Transformers / Cleaners
# -----------------------------------------------------------------------------

def clean_and_transform_data(raw_json: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    From the 'raw_json' of /studies, produce a simplified list of dicts.
    This is your existing function, but we can expand it to handle new fields.
    """
    if "studies" not in raw_json:
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

        # Example: parse enrollment
        enrollment_info = design_module.get("enrollmentInfo", {})
        enrollment = enrollment_info.get("count", None)  # can be int or None

        # parse startDate
        start_date_struct = status_module.get("startDateStruct", {})
        start_date = start_date_struct.get("date")

        # parse conditions
        conditions = conditions_module.get("conditions", [])

        # skip if obviously invalid
        if nct_id == "N/A" or brief_title == "No Title":
            continue

        cleaned_record = {
            "nctId": nct_id,
            "briefTitle": brief_title,
            "overallStatus": overall_status,
            "hasResults": has_results,
            "enrollment": enrollment,
            "startDate": start_date,
            "conditions": conditions
        }

        cleaned_data.append(cleaned_record)

    print(f"[DEBUG clean_and_transform_data] returning {len(cleaned_data)} items.")
    return cleaned_data

# Example: Parse participant flow (funnel) from a single-study JSON
def parse_participant_flow(results_section: Dict[str, Any]) -> Dict[str, Any]:
    """
    If the single-study JSON includes resultsSection.participantFlowModule,
    parse it into a simpler funnel structure that also includes dropWithdraw data.
    """
    flow_module = results_section.get("participantFlowModule", {})
    if not flow_module:
        return {}

    funnel_data = {}
    periods = flow_module.get("periods", [])
    total_started = 0
    total_completed = 0
    total_dropped = 0
    drop_reasons = {}  # e.g. {"Physician Decision": X, "Withdrawal by Subject": Y, ...}

    for period in periods:
        # 1) Summation of participants from milestones
        milestones = period.get("milestones", [])
        for m in milestones:
            achievements = m.get("achievements", [])
            for a in achievements:
                # convert to int
                num_subjects_str = a.get("flowAchievementNumSubjects", "0")
                try:
                    num_subjects = int(num_subjects_str)
                except:
                    num_subjects = 0

                if m.get("type", "").upper() == "STARTED":
                    total_started += num_subjects
                elif m.get("type", "").upper() == "COMPLETED":
                    total_completed += num_subjects
                # optional: handle other milestone types if needed

        # 2) Summation from dropWithdraw
        drop_withdraws = period.get("dropWithdraws", [])
        for dw in drop_withdraws:
            reason_type = dw.get("type", "Unknown")
            reasons_list = dw.get("reasons", [])
            reason_sum = 0
            for r in reasons_list:
                num_str = r.get("numSubjects", "0")
                try:
                    num_val = int(num_str)
                except:
                    num_val = 0

                reason_sum += num_val
                total_dropped += num_val
            drop_reasons[reason_type] = drop_reasons.get(reason_type, 0) + reason_sum

    # Summarize
    funnel_data["totalStarted"] = total_started
    funnel_data["totalCompleted"] = total_completed
    funnel_data["totalDropped"] = total_dropped
    funnel_data["dropReasons"] = drop_reasons

    return funnel_data
