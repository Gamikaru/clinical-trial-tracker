
from fastapi import HTTPException
from loguru import logger
import requests

def _handle_errors(response: requests.Response):
    """
    Raises HTTPException if the response contains an HTTP error status.
    Logs the error details.
    """
    try:
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        logger.error(f"Request failed with status {response.status_code}: {response.text}")
        raise HTTPException(
            status_code=response.status_code,
            detail=f"Error from upstream API: {response.text}"
        ) from e