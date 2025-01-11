# data.services.api.routers.studies

from fastapi import APIRouter, HTTPException, Request
from typing import Optional, List
from services.service import fetch_single_study, check_rate_limit
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