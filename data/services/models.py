# File: services/models.py

from pydantic import BaseModel, Field, conint
from typing import Optional

class GeoStatsQuery(BaseModel):
    """
    Pydantic model to validate query parameters for the geo-stats endpoint.
    """
    condition: str = Field(..., description="Condition to filter by, e.g. 'cancer'")
    latitude: float = Field(..., description="Latitude for geo filter, e.g. 39.00357")
    longitude: float = Field(..., description="Longitude for geo filter, e.g. -77.10133")
    radius: str = Field("50mi", description="Radius, e.g. '50mi' or '100km'")
    page_size: conint(gt=0, le=1000) = Field(100, description="Number of results per page, up to 1000")
