# data.services.api.filtered_studies

from fastapi import APIRouter, Query, HTTPException, Request
from typing import Optional, List
from services.service import (
    fetch_raw_data,
    clean_and_transform_data,
    check_rate_limit
)
from loguru import logger

router = APIRouter()

@router.get("/")
def get_filtered_studies(
    request: Request,
    conditions: Optional[List[str]] = Query(default=["cancer"]),
    page_size: int = Query(default=10, ge=1, le=1000),
    only_with_results: bool = Query(default=False),
    page_token: Optional[str] = Query(None),
    search_term: Optional[str] = Query(None),
    overall_status: Optional[List[str]] = Query(None),
    location_str: Optional[str] = Query(None),
    advanced_filter: Optional[str] = Query(None)
):
    # Update condition handling
    condition_query = " AND ".join(conditions) if conditions else "cancer"
    raw_json = fetch_raw_data(
        condition=condition_query,
        page_size=page_size,
        page_token=page_token,
        overall_status=overall_status,
        search_term=search_term,
        location_str=location_str,
        advanced_filter=advanced_filter
    )
    """
    GET /api/filtered-studies with advanced query support.

    Example:
    /api/filtered-studies?condition=heart disease
                           &search_term=AREA[LastUpdatePostDate]RANGE[2023-01-15,MAX]
                           &page_size=5
                           &overall_status=RECRUITING
                           &only_with_results=true
    """
    client_ip = request.client.host
    check_rate_limit(client_ip)

    try:
        raw_json = fetch_raw_data(
            condition=condition_query,
            page_size=page_size,
            page_token=page_token,
            overall_status=overall_status,
            search_term=search_term,
            location_str=location_str,
            advanced_filter=advanced_filter
        )

        logger.debug(f"get_filtered_studies | Raw JSON data fetched: {raw_json}")

        cleaned_data = clean_and_transform_data(raw_json)
        logger.debug(f"get_filtered_studies | Cleaned data: {cleaned_data}")

        if only_with_results:
            cleaned_data = [s for s in cleaned_data if s.get("hasResults")]
            logger.debug(f"get_filtered_studies | Filtered data with results: {cleaned_data}")

        next_token = raw_json.get("nextPageToken", None)
        logger.debug(f"get_filtered_studies | Next page token: {next_token}")

        return {
            "count": len(cleaned_data),
            "studies": cleaned_data,
            "nextPageToken": next_token
        }

    except HTTPException as e:
        logger.error(f"get_filtered_studies | HTTPException: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("get_filtered_studies | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/filtered-studies/geo-bounds")
def get_filtered_studies_geo_bounds(
    request: Request,
    north: float = Query(..., description="Northern latitude"),
    south: float = Query(..., description="Southern latitude"),
    east: float = Query(..., description="Eastern longitude"),
    west: float = Query(..., description="Western longitude"),
    page_size: int = Query(10, ge=1, le=1000, description="Number of studies per page"),
    page_token: Optional[str] = Query(None, description="Token for pagination")
):
    client_ip = request.client.host
    check_rate_limit(client_ip)

    try:
        # Construct bounding box filter
        location_str = f"bounding_box({north},{south},{east},{west})"
        logger.debug(f"get_filtered_studies_geo_bounds | Bounding Box Filter: {location_str}")

        raw_json = fetch_raw_data(
            location_str=location_str,
            page_size=page_size,
            page_token=page_token
        )
        logger.debug(f"get_filtered_studies_geo_bounds | Raw JSON data fetched: {raw_json}")

        # Clean and transform the data
        cleaned_data = clean_and_transform_data(raw_json)
        logger.debug(f"get_filtered_studies_geo_bounds | Cleaned data: {cleaned_data}")

        # Handle pagination token
        next_token = raw_json.get("nextPageToken", None)
        logger.debug(f"get_filtered_studies_geo_bounds | Next page token: {next_token}")

        return {
            "count": len(cleaned_data),
            "studies": cleaned_data,
            "nextPageToken": next_token
        }

    except HTTPException as e:
        logger.error(f"get_filtered_studies_geo_bounds | HTTPException: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("get_filtered_studies_geo_bounds | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))