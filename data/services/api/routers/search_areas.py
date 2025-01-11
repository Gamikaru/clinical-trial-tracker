# data.services.api.routers.search_areas

from fastapi import APIRouter, HTTPException, Request
from services.service import fetch_search_areas, check_rate_limit
from loguru import logger

router = APIRouter()

@router.get("/search-areas")
def get_search_areas_endpoint(request: Request = None):
    """
    Retrieve all search areas.
    """
    client_ip = request.client.host if request else "unknown"
    check_rate_limit(client_ip)

    try:
        search_areas = fetch_search_areas()
        logger.debug(f"get_search_areas_endpoint | Retrieved search areas: {search_areas}")
        return search_areas
    except HTTPException as e:
        logger.error(f"get_search_areas_endpoint | HTTPException: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("get_search_areas_endpoint | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))