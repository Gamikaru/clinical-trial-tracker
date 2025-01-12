from fastapi import APIRouter, HTTPException, Request
from services.service import fetch_raw_data, clean_and_transform_data, check_rate_limit
from loguru import logger
import pandas as pd

router = APIRouter()

@router.get("/enrollment-stats")
async def get_enrollment_stats(request: Request):
    """
    Endpoint to calculate and retrieve enrollment statistics across studies.
    """
    client_ip = request.client.host
    check_rate_limit(client_ip)  # Enforce rate limiting based on client IP

    try:
        all_data = []
        page_size = 100
        page_token = None
        max_pages = 10  # Adjust as needed

        for _ in range(max_pages):
            raw_data = fetch_raw_data(condition="cancer", page_size=page_size, page_token=page_token)
            cleaned_data = clean_and_transform_data(raw_data)
            if not cleaned_data:
                break
            all_data.extend(cleaned_data)
            logger.debug(f"Fetched and cleaned data for page_token {page_token}")

            # Assuming the API returns 'nextPageToken'
            page_token = raw_data.get('nextPageToken')
            if not page_token:
                break

        if not all_data:
            raise HTTPException(status_code=500, detail="No studies found in fetched data.")

        # Convert the aggregated data to a Pandas DataFrame for analysis
        df = pd.DataFrame(all_data)
        logger.debug(f"get_enrollment_stats | DataFrame Columns: {df.columns.tolist()}")

        # Calculate various enrollment statistics
        total_studies = len(df)
        if 'enrollment_count' not in df.columns:
            raise HTTPException(status_code=500, detail="Missing 'enrollment_count' in data")
        average_enrollment = df['enrollment_count'].mean()
        median_enrollment = df['enrollment_count'].median()
        enrollment_percentiles = df['enrollment_count'].quantile([0.05, 0.10, 0.25, 0.50, 0.75, 0.90, 0.95]).to_dict()
        enrollment_ranges = {str(interval): count for interval, count in df['enrollment_count'].value_counts(bins=10).to_dict().items()}

        logger.info(f"get_enrollment_stats | Calculated statistics: total_studies={total_studies}, average_enrollment={average_enrollment}, median_enrollment={median_enrollment}")

        return {
            "total_studies": total_studies,
            "average_enrollment": float(average_enrollment),
            "median_enrollment": float(median_enrollment),
            "enrollment_percentiles": enrollment_percentiles,
            "enrollment_ranges": enrollment_ranges
        }
    except HTTPException as e:
        logger.error(f"get_enrollment_stats | HTTPException: {e.detail}")
        raise e  # Re-raise HTTP exceptions to be handled by FastAPI
    except KeyError as e:
        logger.error(f"get_enrollment_stats | KeyError: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Data processing error: {str(e)}")
    except Exception as e:
        logger.exception("get_enrollment_stats | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(e))