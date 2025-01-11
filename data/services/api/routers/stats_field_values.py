# data.services.api.routers.stats_field_values

from fastapi import APIRouter, HTTPException, Request, Query
from typing import List, Optional
from services.service import fetch_field_values, check_rate_limit
from loguru import logger

router = APIRouter()

@router.get("/stats/field/values")
def get_stats_field_values(
    fields: List[str],
    field_types: Optional[List[str]] = None,
    request: Request = None
):
    """
    Retrieve field values statistics.
    """
    client_ip = request.client.host if request else "unknown"
    check_rate_limit(client_ip)

    try:
        field_values = fetch_field_values(fields, field_types)
        logger.debug(f"get_stats_field_values | Retrieved field values: {field_values}")
        return field_values
    except HTTPException as e:
        logger.error(f"get_stats_field_values | HTTPException: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("get_stats_field_values | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))