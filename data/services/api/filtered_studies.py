# services/api/filtered_studies.py

from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List

from services.service import (
    fetch_raw_data,
    clean_and_transform_data
)

router = APIRouter()

@router.get("/filtered-studies")
def get_filtered_studies(
    condition: Optional[str] = Query(default="cancer", description="Condition to filter by"),
    page_size: int = Query(default=10, description="Number of results per page"),
    only_with_results: bool = Query(default=False, description="Return only studies with posted results"),
    page_token: Optional[str] = Query(default=None, description="Pagination page token"),
    # Additional query params
    search_term: Optional[str] = Query(None, description="Additional 'query.term' param"),
    overall_status: Optional[List[str]] = Query(None, description="List of statuses, e.g. RECRUITING, COMPLETED"),
    location_str: Optional[str] = Query(None, description="Geo filter, e.g. 'distance(39.0,-77.1,50mi)'"),
    advanced_filter: Optional[str] = Query(None, description="Essie expression, e.g. 'AREA[StartDate]2022'")
):
    """
    GET /api/filtered-studies with advanced query support.

    Example usage:
      /api/filtered-studies?condition=heart disease
                           &search_term=AREA[LastUpdatePostDate]RANGE[2023-01-15,MAX]
                           &page_size=5
                           &overall_status=RECRUITING
                           &only_with_results=true
    """
    try:
        # 1) Fetch raw data with advanced parameters
        raw_json = fetch_raw_data(
            condition=condition,
            page_size=page_size,
            page_token=page_token,
            overall_status=overall_status,
            search_term=search_term,
            location_str=location_str,
            advanced_filter=advanced_filter
        )

        # 2) Clean/transform
        cleaned_data = clean_and_transform_data(raw_json)

        # 3) Optionally filter by hasResults
        if only_with_results:
            cleaned_data = [s for s in cleaned_data if s.get("hasResults")]

        # If the official API includes nextPageToken, pass it to the response
        next_token = raw_json.get("nextPageToken", None)

        return {
            "count": len(cleaned_data),
            "studies": cleaned_data,
            "nextPageToken": next_token
        }

    except Exception as exc:
        # If anything goes wrong, return a 500
        raise HTTPException(status_code=500, detail=str(exc))
