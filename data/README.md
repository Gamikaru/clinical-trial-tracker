# Clinical Trials API

This repository is a FastAPI project that fetches, cleans, and serves data from [ClinicalTrials.gov API v2](https://clinicaltrials.gov/api/v2).

## Features

- **Advanced Filtering**: Use query params to filter by condition, status, location, etc.
- **Search Areas**: Retrieves enumerations, search docs, metadata from official endpoints.
- **Caching**: Speeds repeated requests with `requests-cache`.
- **Docker**: Containerize the app for reliable deployment.
- **pytest Tests**: Automated unit & integration tests.

## Quick Start

1. **Install Requirements Locally (Without Docker)**:
    ```bash
    pip install -r requirements.txt
    python main.py
    ```

2. **Run with Docker**:
    - **Build the Docker Image**:
      ```bash
      docker build -t clinical-trials-api .
      ```
    - **Run the Docker Container**:
      ```bash
      docker run -d -p 8000:8000 clinical-trials-api
      ```
    - **Make Changes and Rebuild**:
      If you make changes to the code, rebuild the Docker image:
      ```bash
      docker build --no-cache -t clinical-trials-api .
      docker run -d -p 8000:8000 clinical-trials-api
      ```

## Directory Structure

```
/Ubuntu/home/username/projects/fullstack/trial-tracker/data/
├── README.md
├── services/
│   ├── service.py
│   └── api/
│       ├── advanced.py
│       └── filtered_studies.py
├── tests/
│   ├── test_api.py
│   └── test_service.py
└── main.py
```

## API Endpoints

- **GET /api/studies/{nct_id}**: Retrieve a single study by NCT ID.
- **GET /api/study-results/participant-flow/{nct_id}**: Retrieve participant flow for a study.
- **GET /api/enums**: Get all enumerations.
- **GET /api/search-areas**: Get all search areas.
- **GET /api/stats/size**: Get study sizes.
- **GET /api/stats/field/values**: Get field values stats.
- **GET /api/geo-stats**: Get geographical statistics.
- **GET /api/filtered-studies**: Get filtered studies with advanced query support.

## Testing

Run the tests using `pytest`:
```bash
`pytest`
```
