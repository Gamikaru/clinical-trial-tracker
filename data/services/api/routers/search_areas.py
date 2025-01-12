from fastapi import APIRouter, HTTPException, Request, Query
from services.service import get_search_areas, check_rate_limit
from loguru import logger
from typing import Optional

router = APIRouter()

@router.get("/search-areas")
def get_search_areas_endpoint(
    request: Request = None,
    name: Optional[str] = Query(None, description="Filter by search area name"),
    param: Optional[str] = Query(None, description="Filter by search area param")
):
    """
    Retrieve all search areas or filter by name or param.

    Args:
        request (Request): The incoming request object.
        name (str): The name of the search area to filter by.
        param (str): The param of the search area to filter by.

    Returns:
        List[Dict[str, Any]]: A list of search areas and their details.
    """
    client_ip = request.client.host if request else "unknown"
    check_rate_limit(client_ip)

    try:
        search_areas = get_search_areas(request, name, param)
        logger.debug(f"get_search_areas_endpoint | Retrieved search areas: {search_areas}")
        return search_areas
    except HTTPException as e:
        logger.error(f"get_search_areas_endpoint | HTTPException: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("get_search_areas_endpoint | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))