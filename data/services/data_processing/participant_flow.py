#data.services.data_processing.participant_flow

from typing import Dict, Any, List, Tuple
from loguru import logger

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