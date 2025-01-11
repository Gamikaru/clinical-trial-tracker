# data.services.api.routers.enums

from fastapi import APIRouter, HTTPException, Request
from services.service import fetch_study_enums, check_rate_limit
from loguru import logger

router = APIRouter()

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