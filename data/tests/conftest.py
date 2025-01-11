# File: tests/conftest.py

import pytest
from fastapi.testclient import TestClient
from fastapi import FastAPI
from services.api.advanced import router as advanced_router
from services.api.filtered_studies import router as filtered_studies_router


@pytest.fixture(scope="module")
def test_app():
    """
    Fixture to create a FastAPI app with all necessary routers included.
    """
    app = FastAPI()
    app.include_router(advanced_router, prefix="/api", tags=["Advanced"])
    app.include_router(filtered_studies_router, prefix="/api/filtered-studies", tags=["Filtered Studies"])
    return app


@pytest.fixture(scope="module")
def client(test_app):
    """
    Fixture to provide a TestClient for the FastAPI app.
    """
    return TestClient(test_app)