from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.api import advanced, filtered_studies
# Import routers
from loguru import logger  # Import Loguru for logging

# Initialize the FastAPI application
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],  # List of allowed methods
    allow_headers=["*"],  # List of allowed headers
)

# Include the 'advanced' router with the prefix '/api'
app.include_router(advanced.router, prefix="/api", tags=["Advanced"])

# Include the 'filtered_studies' router with the prefix '/api/filtered-studies'
app.include_router(filtered_studies.router, prefix="/api/filtered-studies", tags=["Filtered Studies"])

# Include the 'enrollment_stats' router with the prefix '/api'
# app.include_router(enrollment_stats.router, prefix="/api", tags=["Enrollment Stats"])

@app.get("/", include_in_schema=True)
async def root():
    """
    Root endpoint to verify that the server is running.
    """
    return {"message": "Hello from the Python backend with advanced features!"}