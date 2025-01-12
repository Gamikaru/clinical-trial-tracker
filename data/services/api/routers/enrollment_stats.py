from fastapi import APIRouter, HTTPException, Request
from services.service import fetch_raw_data, clean_and_transform_data, check_rate_limit
from loguru import logger
import pandas as pd
import asyncio

router = APIRouter()

@router.get("/enrollment-stats")
async def get_enrollment_stats(request: Request):
    """
    Endpoint to calculate and retrieve enrollment statistics across studies.
    """
    client_ip = request.client.host
    check_rate_limit(client_ip)  # Enforce rate limiting based on client IP

    try:
        all_data = await fetch_all_data()
        if not all_data:
            raise HTTPException(status_code=500, detail="No studies found in fetched data.")

        df = pd.DataFrame(all_data)
        logger.debug(f"get_enrollment_stats | DataFrame Columns: {df.columns.tolist()}")

        stats = calculate_statistics(df)
        logger.info(f"get_enrollment_stats | Calculated statistics: {stats}")

        return stats
    except HTTPException as e:
        logger.error(f"get_enrollment_stats | HTTPException: {e.detail}")
        raise e  # Re-raise HTTP exceptions to be handled by FastAPI
    except KeyError as e:
        logger.error(f"get_enrollment_stats | KeyError: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Data processing error: {str(e)}")
    except Exception as e:
        logger.exception("get_enrollment_stats | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(e))

async def fetch_all_data():
    page_size = 100
    max_pages = 10  # Adjust as needed
    all_data = []
    page_tokens = [None]  # Start with no page_token

    async def fetch_and_clean(page_token):
        raw_data = await fetch_raw_data(condition="cancer", page_size=page_size, page_token=page_token)
        cleaned = clean_and_transform_data(raw_data)
        logger.debug(f"Fetched and cleaned data for page_token {page_token}")
        return cleaned, raw_data.get('nextPageToken')

    tasks = [fetch_and_clean(token) for token in page_tokens]
    for _ in range(max_pages):
        results = await asyncio.gather(*tasks)
        tasks = []
        for cleaned_data, next_token in results:
            if cleaned_data:
                all_data.extend(cleaned_data)
            if next_token:
                tasks.append(fetch_and_clean(next_token))
        if not tasks:
            break  # No more pages

    return all_data

def calculate_statistics(df):
    total_studies = len(df)
    if 'enrollment_count' not in df.columns:
        raise HTTPException(status_code=500, detail="Missing 'enrollment_count' in data")
    average_enrollment = df['enrollment_count'].mean()
    median_enrollment = df['enrollment_count'].median()
    enrollment_percentiles = df['enrollment_count'].quantile([0.05, 0.10, 0.25, 0.50, 0.75, 0.90, 0.95]).to_dict()
    enrollment_ranges = {str(interval): count for interval, count in df['enrollment_count'].value_counts(bins=10).to_dict().items()}

    return {
        "total_studies": total_studies,
        "average_enrollment": float(average_enrollment),
        "median_enrollment": float(median_enrollment),
        "enrollment_percentiles": enrollment_percentiles,
        "enrollment_ranges": enrollment_ranges
    }