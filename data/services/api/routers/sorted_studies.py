# data.services.api.routers.sorted_studies

from fastapi import APIRouter, HTTPException, Request, Query
from typing import Optional, List
from services.service import fetch_raw_data, clean_and_transform_data, check_rate_limit
from loguru import logger

# Initialize the APIRouter
router = APIRouter()

@router.get("/sorted-studies/multiple-fields")
def get_sorted_studies_multiple_fields(
    request: Request,
    sort_by: Optional[List[str]] = Query(
        None, description="Fields to sort by, e.g., enrollment_count, start_date"
    ),
    sort_order: Optional[List[str]] = Query(
        None, description="Sort order for each field, e.g., asc, desc"
    ),
    page_size: int = Query(
        10, ge=1, le=1000, description="Number of studies per page"
    ),
    page_token: Optional[str] = Query(
        None, description="Token for pagination"
    )
):
    """
    Retrieve studies sorted by specified multiple fields.

    Example:
    /api/sorted-studies/multiple-fields?sort_by=enrollment_count&sort_by=start_date&sort_order=asc&sort_order=desc&page_size=5
    """
    client_ip = request.client.host
    logger.debug(f"Received request from IP: {client_ip}")

    # Check if the client has exceeded the rate limit
    check_rate_limit(client_ip)
    logger.info(f"Rate limit check passed for IP: {client_ip}")

    try:
        # Validate and construct sort parameters
        if sort_by and sort_order:
            if len(sort_by) != len(sort_order):
                logger.error("Mismatch between sort_by and sort_order lengths.")
                raise HTTPException(
                    status_code=400,
                    detail="The number of sort_by fields must match the number of sort_order fields."
                )
            sort_params = [
                f"{field}:{order.lower()}" for field, order in zip(sort_by, sort_order)
            ]
            logger.debug(f"Sort parameters with order: {sort_params}")
        elif sort_by:
            # Default sort order is ascending
            sort_params = [f"{field}:asc" for field in sort_by]
            logger.debug(f"Sort parameters with default order: {sort_params}")
        else:
            sort_params = []
            logger.debug("No sort parameters provided.")

        # Fetch raw data based on sort parameters and pagination
        raw_json = fetch_raw_data(
            sort=sort_params,
            page_size=page_size,
            page_token=page_token
        )
        logger.debug(f"Raw JSON data fetched: {raw_json}")

        # Clean and transform the fetched data
        cleaned_data = clean_and_transform_data(raw_json)
        logger.debug(f"Cleaned data: {cleaned_data}")

        # Handle pagination token for the next page
        next_token = raw_json.get("nextPageToken", None)
        logger.debug(f"Next page token: {next_token}")

        # Prepare the response payload
        response = {
            "count": len(cleaned_data),
            "studies": cleaned_data,
            "nextPageToken": next_token
        }
        logger.info(f"Returning response: {response}")

        return response

    except HTTPException as e:
        logger.error(f"HTTPException occurred: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("An unexpected error occurred in get_sorted_studies_multiple_fields.")
        raise HTTPException(status_code=500, detail=str(exc))