# data.services.api.routers.enrollment_insights
from fastapi import APIRouter, HTTPException, Request
from services.service import fetch_raw_data, clean_and_transform_data, analyze_enrollment_data, check_rate_limit
from loguru import logger

router = APIRouter()

@router.get("/enrollment-insights")
def get_enrollment_insights(request: Request):
    client_ip = request.client.host
    check_rate_limit(client_ip)

    try:
        raw_data = fetch_raw_data(condition="cancer", page_size=100)
        cleaned_data = clean_and_transform_data(raw_data)
        insights = analyze_enrollment_data(cleaned_data)

        return insights
    except HTTPException as e:
        logger.error(f"get_enrollment_insights | HTTPException: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("get_enrollment_insights | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))