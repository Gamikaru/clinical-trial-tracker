#data.services.data_processing.data_cleaning

from typing import List, Dict, Any
from loguru import logger

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
        enrollment_count = enrollment_info.get("count", 0)  # Ensure default is 0

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