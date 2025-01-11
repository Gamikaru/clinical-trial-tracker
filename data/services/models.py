# data.services.models

from pydantic import BaseModel, Field, validator
from typing import Optional

class GeoStatsQuery(BaseModel):
    """
    Pydantic model to validate query parameters for the geo-stats endpoint.
    """
    condition: str = Field(..., description="Condition to filter by, e.g. 'cancer'")
    latitude: float = Field(..., description="Latitude for geo filter, e.g. 39.00357")
    longitude: float = Field(..., description="Longitude for geo filter, e.g. -77.10133")
    radius: str = Field("50mi", description="Radius, e.g. '50mi' or '100km'")
    page_size: Optional[int] = Field(100, description="Number of results per page, up to 1000")

    @validator('page_size')
    def validate_page_size(cls, v):
        if v is not None and (v <= 0 or v > 1000):
            raise ValueError('page_size must be greater than 0 and less than or equal to 1000')
        return v