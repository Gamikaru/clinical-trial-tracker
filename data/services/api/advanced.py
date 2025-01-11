# data.services.api.advanced

from fastapi import APIRouter
from services.api.routers import (
    studies,
    participant_flow,
    enums,
    search_areas,
    stats_size,
    stats_field_values,
    geo_stats,
    time_stats,
    enrollment_insights,
    sorted_studies,
    enriched_studies
)

router = APIRouter()

# Include sub-routers
router.include_router(studies.router)
router.include_router(participant_flow.router)
router.include_router(enums.router)
router.include_router(search_areas.router)
router.include_router(stats_size.router)
router.include_router(stats_field_values.router)
router.include_router(geo_stats.router)
router.include_router(time_stats.router)
router.include_router(enrollment_insights.router)
router.include_router(sorted_studies.router)
router.include_router(enriched_studies.router)