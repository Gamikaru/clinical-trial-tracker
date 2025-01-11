# FILE:data\services\api\routers\enriched_studies.py

from fastapi import APIRouter, HTTPException, Request, Query
from typing import Optional, List, Dict, Any
from services.service import (
    fetch_raw_data,
    clean_and_transform_data,
    calculate_enrollment_rates,
    aggregate_conditions,
    check_rate_limit
)
from loguru import logger
import pandas as pd
from datetime import datetime

# Initialize the APIRouter
router = APIRouter()



@router.get("/enriched-studies/multi-conditions")
def get_enriched_studies(
    request: Request,
    conditions: Optional[List[str]] = Query(
        None, description="List of conditions to filter by"
    ),
    page_size: int = Query(
        10, ge=1, le=1000, description="Number of studies per page"
    ),
    page_token: Optional[str] = Query(
        None, description="Token for pagination"
    )
):
    """
    Retrieve enriched studies filtered by multiple conditions with calculated enrollment rates and condition aggregation.

    Example:
    /api/enriched-studies/multi-conditions?conditions=cancer&conditions=diabetes&page_size=5
    """
    client_ip = request.client.host
    logger.debug(f"Received request from IP: {client_ip}")

    # Check if the client has exceeded the rate limit
    check_rate_limit(client_ip)
    logger.info(f"Rate limit check passed for IP: {client_ip}")

    try:
        # Construct the condition query string
        query_conditions = " AND ".join(conditions) if conditions else "cancer"
        logger.debug(f"Constructed query conditions: {query_conditions}")

        # Fetch raw data based on conditions and pagination
        raw_json = fetch_raw_data(
            condition=query_conditions,
            page_size=page_size,
            page_token=page_token
        )
        logger.debug(f"Raw JSON data fetched: {raw_json}")

        # Clean and transform the fetched data
        cleaned_data = clean_and_transform_data(raw_json)
        logger.debug(f"Cleaned data: {cleaned_data}")

        # Calculate enrollment rates for each study
        enriched_data = calculate_enrollment_rates(cleaned_data)
        logger.debug(f"Enriched data with enrollment rates: {enriched_data}")

        # Aggregate conditions from the enriched data
        condition_counts = aggregate_conditions(enriched_data)
        logger.debug(f"Aggregated condition counts: {condition_counts}")

        # Handle pagination token for the next page
        next_token = raw_json.get("nextPageToken", None)
        logger.debug(f"Next page token: {next_token}")

        # Prepare the response payload
        response = {
            "count": len(enriched_data),
            "studies": enriched_data,
            "condition_counts": condition_counts,
            "nextPageToken": next_token
        }
        logger.info(f"Returning response: {response}")

        return response

    except HTTPException as e:
        logger.error(f"HTTPException occurred: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("An unexpected error occurred in get_enriched_studies.")
        raise HTTPException(status_code=500, detail=str(exc))