# data.services.api.routers.participant_flow

from fastapi import APIRouter, HTTPException, Request
from services.service import fetch_single_study, parse_participant_flow, check_rate_limit
from loguru import logger

router = APIRouter()

@router.get("/study-results/participant-flow/{nct_id}")
def get_participant_flow_endpoint(nct_id: str, request: Request = None):
    """
    Retrieve a single study's participant flow, parse it into funnel data.
    """
    client_ip = request.client.host if request else "unknown"
    check_rate_limit(client_ip)

    try:
        # Request 'protocolSection' and 'resultsSection' as separate fields
        data = fetch_single_study(nct_id, fields=["protocolSection", "resultsSection"])

        if not data.get("resultsSection"):
            logger.debug(f"get_participant_flow_endpoint | No results section found for NCT ID={nct_id}")
            return {"message": "No results section found for this study"}

        funnel = parse_participant_flow(data["resultsSection"])
        logger.debug(f"get_participant_flow_endpoint | Parsed funnel data: {funnel}")
        return {"funnel": funnel}
    except HTTPException as e:
        logger.error(f"get_participant_flow_endpoint | HTTPException: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("get_participant_flow_endpoint | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))