# data.main
from fastapi import FastAPI, HTTPException, Request
from services.service import (
    fetch_raw_data,
    clean_and_transform_data,
    check_rate_limit
)
from services.models import GeoStatsQuery
from services.api import advanced, filtered_studies  # Import routers
import pandas as pd  # Import Pandas for data manipulation
from loguru import logger  # Import Loguru for logging

# Initialize the FastAPI application
app = FastAPI()

# Include the 'advanced' router with the prefix '/api'
app.include_router(advanced.router, prefix="/api", tags=["Advanced"])

# Include the 'filtered_studies' router with the prefix '/api/filtered-studies'
app.include_router(filtered_studies.router, prefix="/api/filtered-studies", tags=["Filtered Studies"])

@app.get("/", include_in_schema=True)
async def root():
    """
    Root endpoint to verify that the server is running.
    """
    return {"message": "Hello from the Python backend with advanced features!"}

@app.get("/api/enrollment-stats")
async def get_enrollment_stats(request: Request):
    """
    Endpoint to calculate and retrieve average enrollment across studies.
    """
    client_ip = request.client.host
    check_rate_limit(client_ip)  # Enforce rate limiting based on client IP

    try:
        # Fetch raw data with a larger page size for comprehensive statistics
        raw_data = fetch_raw_data(condition="cancer", page_size=100)
        cleaned_data = clean_and_transform_data(raw_data)
        logger.debug(f"get_enrollment_stats | Cleaned data: {cleaned_data}")

        # Convert the cleaned data to a Pandas DataFrame for analysis
        df = pd.DataFrame(cleaned_data)
        logger.debug(f"get_enrollment_stats | DataFrame Columns: {df.columns.tolist()}")

        # Calculate the average enrollment using the standardized 'enrollment_count' key
        average_enrollment = df['enrollment_count'].mean()
        logger.info(f"get_enrollment_stats | Calculated average enrollment: {average_enrollment}")

        return {"average_enrollment": float(average_enrollment)}  # Convert to native Python float
    except HTTPException as e:
        logger.error(f"get_enrollment_stats | HTTPException: {e.detail}")
        raise e  # Re-raise HTTP exceptions to be handled by FastAPI
    except KeyError as e:
        logger.error(f"get_enrollment_stats | KeyError: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Data processing error: {str(e)}")
    except Exception as e:
        logger.exception("get_enrollment_stats | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(e))