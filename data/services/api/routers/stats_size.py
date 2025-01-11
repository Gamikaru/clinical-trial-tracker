# data.services.api.routers.stats_size

from fastapi import APIRouter, HTTPException, Request
from services.service import fetch_study_sizes, check_rate_limit
from loguru import logger

router = APIRouter()

@router.get("/stats/size")
def get_stats_size(request: Request = None):
    """
    Retrieve study sizes statistics.
    """
    client_ip = request.client.host if request else "unknown"
    check_rate_limit(client_ip)

    try:
        study_sizes = fetch_study_sizes()
        logger.debug(f"get_stats_size | Retrieved study sizes: {study_sizes}")
        return study_sizes
    except HTTPException as e:
        logger.error(f"get_stats_size | HTTPException: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("get_stats_size | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))