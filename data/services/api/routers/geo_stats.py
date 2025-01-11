# data.services.api.routers.geo_stats

from fastapi import APIRouter, HTTPException, Depends, Request, Query
from services.service import fetch_raw_data, clean_and_transform_data, check_rate_limit
from services.models import GeoStatsQuery
from loguru import logger

router = APIRouter()

@router.get("/geo-stats")
def get_geo_stats(
    query: GeoStatsQuery = Depends(),
    request: Request = None
):
    """
    Advanced geospatial aggregator using validated query params from Pydantic.
    """
    client_ip = request.client.host if request else "unknown"
    check_rate_limit(client_ip)

    try:
        # Construct the geo filter string based on latitude, longitude, and radius
        location_str = f"distance({query.latitude},{query.longitude},{query.radius})"
        raw_data = fetch_raw_data(
            condition=query.condition,
            location_str=location_str,
            page_size=query.page_size,
            fields=[
                "protocolSection.identificationModule.nctId",
                "protocolSection.identificationModule.briefTitle",
                "protocolSection.contactsLocationsModule.locations"
            ]
        )
        if raw_data is None:
            logger.error("get_geo_stats | fetch_raw_data returned None.")
            raise HTTPException(status_code=500, detail="Failed to fetch raw data.")

        studies = raw_data.get("studies", [])
        country_counts = {}

        for study in studies:
            contacts_mod = study.get("protocolSection", {}).get("contactsLocationsModule", {})
            locs = contacts_mod.get("locations", [])
            for loc in locs:
                country = loc.get("country", "Unknown")
                country_counts[country] = country_counts.get(country, 0) + 1

        logger.debug(f"get_geo_stats | Total studies: {len(studies)}, Country counts: {country_counts}")

        return {
            "totalStudies": len(studies),
            "countryCounts": country_counts
        }
    except HTTPException as e:
        logger.error(f"get_geo_stats | HTTPException: {e.detail}")
        raise e
    except Exception as exc:
        logger.exception("get_geo_stats | Unexpected error.")
        raise HTTPException(status_code=500, detail=str(exc))