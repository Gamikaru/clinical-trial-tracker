# data.services.analysis.enrollment_analysis
from typing import List, Dict, Any
from datetime import datetime
from loguru import logger
import pandas as pd

@logger.catch
def analyze_enrollment_data(cleaned_data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyzes enrollment data to provide statistics.

    Args:
        cleaned_data (List[Dict[str, Any]]): List of cleaned study data.

    Returns:
        Dict[str, Any]: Enrollment statistics including average, total, and distribution.
    """
    logger.debug("Starting enrollment data analysis.")
    df = pd.DataFrame(cleaned_data)
    enrollment_stats = {
        "average_enrollment": df['enrollment_count'].mean(),
        "total_enrollment": df['enrollment_count'].sum(),
        "enrollment_distribution": df['enrollment_count'].value_counts().to_dict()
    }
    logger.debug(f"Enrollment statistics: {enrollment_stats}")
    return enrollment_stats

@logger.catch
def calculate_enrollment_rates(cleaned_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Calculates the enrollment rate for each study.

    Enrollment Rate = enrollment_count / (current_year - start_year)

    Args:
        cleaned_data (List[Dict[str, Any]]): List of cleaned study data.

    Returns:
        List[Dict[str, Any]]: Updated list with enrollment_rate added.
    """
    logger.debug("Starting calculation of enrollment rates.")
    current_year = datetime.now().year
    for study in cleaned_data:
        start_date_str = study.get("start_date")
        if start_date_str:
            start_year = int(start_date_str.split("-")[0])
            duration = current_year - start_year
            if duration > 0:
                enrollment_rate = study["enrollment_count"] / duration
                logger.debug(
                    f"Study ID {study.get('id')}: Calculated enrollment_rate = {enrollment_rate}"
                )
                study["enrollment_rate"] = enrollment_rate
            else:
                logger.warning(
                    f"Study ID {study.get('id')}: Duration is non-positive. Setting enrollment_rate to enrollment_count."
                )
                study["enrollment_rate"] = study["enrollment_count"]
        else:
            logger.warning(
                f"Study ID {study.get('id')}: No start_date provided. Setting enrollment_rate to None."
            )
            study["enrollment_rate"] = None
    return cleaned_data

@logger.catch
def aggregate_conditions(cleaned_data: List[Dict[str, Any]]) -> Dict[str, int]:
    """
    Aggregates the number of studies per condition.

    Args:
        cleaned_data (List[Dict[str, Any]]): List of cleaned study data.

    Returns:
        Dict[str, int]: Dictionary with condition as key and count as value.
    """
    condition_counts = {}
    for study in cleaned_data:
        conditions = study.get("conditions", [])
        for condition in conditions:
            condition_counts[condition] = condition_counts.get(condition, 0) + 1
            logger.debug(f"Condition '{condition}' count incremented to {condition_counts[condition]}")
    logger.info(f"aggregate_conditions | Condition counts: {condition_counts}")
    return condition_counts