# data.services.api.routers.enums

from fastapi import APIRouter, HTTPException, Request
from services.service import get_enums, check_rate_limit
from loguru import logger
from typing import Optional
from fastapi.params import Query

router = APIRouter()

@router.get("/enums")
def get_enums_endpoint(request: Request = None, enum_type: Optional[str] = Query(None, description="Filter by enumeration type")):
    """
    Retrieve all study enumerations or filter by a specific enumeration type.

    Args:
        request (Request): The incoming request object.
        enum_type (str): The type of enumeration to filter by.

    Returns:
        List[Dict[str, Any]]: A list of enumeration types and their values.
    """
    client_ip = request.client.host if request else "unknown"
    check_rate_limit(client_ip)

    try:
        enums = get_enums(request)
        if enum_type:
            enums = [enum for enum in enums if enum['type'].lower() == enum_type.lower()]
        logger.debug(f"get_enums_endpoint | Retrieved enums: {enums}")
        return enums
    except HTTPException as e:
        logger.error(f"get_enums_endpoint | HTTPException: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("get_enums_endpoint | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))