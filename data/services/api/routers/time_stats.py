# data.services.api.routers.time_stats

from fastapi import APIRouter, HTTPException, Request, Query
from services.service import fetch_raw_data, check_rate_limit
from loguru import logger

router = APIRouter()

@router.get("/time-stats")
def get_time_stats(
    condition: str,
    start_year: int = 2020,
    request: Request = None
):
    """
    Aggregator to show how many studies were updated or started each year after 'start_year'.
    """
    client_ip = request.client.host if request else "unknown"
    check_rate_limit(client_ip)

    try:
        # Construct the advanced filter string for date range
        time_filter = f"AREA[LastUpdatePostDate]RANGE[{start_year}-01-01,MAX]"
        raw_data = fetch_raw_data(
            condition=condition,
            advanced_filter=time_filter,
            page_size=100,  # Adjust as needed
            fields=["protocolSection.identificationModule.nctId", "protocolSection.statusModule.lastUpdatePostDateStruct.date"]
        )
        studies = raw_data.get("studies", [])
        year_counts = {}

        for study in studies:
            status_mod = study.get("protocolSection", {}).get("statusModule", {})
            last_update_struct = status_mod.get("lastUpdatePostDateStruct", {})
            date_str = last_update_struct.get("date", None)
            if date_str:
                # Extract year from date string, e.g., "2023-05-10" -> "2023"
                year = date_str.split("-")[0]
                year_counts[year] = year_counts.get(year, 0) + 1

        logger.debug(f"time_stats | Total studies: {len(studies)}, Year breakdown: {year_counts}")

        return {
            "totalStudies": len(studies),
            "yearBreakdown": year_counts
        }
    except HTTPException as e:
        logger.error(f"get_time_stats | HTTPException: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("get_time_stats | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))