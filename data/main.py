# main.py

import uvicorn
from fastapi import FastAPI

# Import our API routers
from services.api.filtered_studies import router as filtered_studies_router
from services.api.advanced import router as advanced_router

# Create the FastAPI application
app = FastAPI(
    title="Clinical Trials Data API",
    description=(
        "A Python backend to fetch, clean, and serve clinical trial data "
        "from ClinicalTrials.gov's v2 API."
    ),
    version="1.0.0"
)

@app.get("/")
def root():
    """
    Root endpoint to verify the API is running.
    """
    return {"message": "Hello from the Python backend!"}

# Include  routers:
# 1) The filtered_studies router provides /api/filtered-studies
app.include_router(filtered_studies_router, prefix="/api")

# 2) The advanced router provides endpoints like /api/studies/{nct_id}, etc.
app.include_router(advanced_router, prefix="/api")

if __name__ == "__main__":
    # Run the FastAPI app with reload=True for development convenience
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
