
# Clinical Trials API

This repository is a **FastAPI** project that fetches, cleans, and serves data from [ClinicalTrials.gov API v2](https://clinicaltrials.gov/api/v2).

---

## Features

- **Advanced Filtering**: Use query parameters to filter by condition, status, location, etc.
- **Search Areas**: Retrieve enumerations, search docs, and metadata from official endpoints.
- **Caching**: Speeds repeated requests using `requests-cache`.
- **Rate Limiting**: A token-bucket algorithm to limit requests per IP.
- **Logging**: Configured with **Loguru** for comprehensive debugging and production logs.
- **Docker & Docker Compose**: Containerize your application for reliable deployment.
- **Pytest Tests**: Automated unit & integration tests.
- **Pandas Integration**: Simplifies data manipulation & analysis (e.g., average enrollment).

---

## Quick Start

### 1) Prerequisites

- **Python 3.10** or above
- **Docker** (optional, for container-based usage)

### 2) Local Installation (Without Docker)

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Run the app:
   ```bash
   python main.py
   ```
3. The API is available at [http://127.0.0.1:8000](http://127.0.0.1:8000).

### 3) Run with Docker

1. **Build the Docker Image**:
   ```bash
   docker build -t clinical-trials-api .
   ```
2. **Run the Docker Container**:
   ```bash
   docker run -d -p 8000:8000 clinical-trials-api
   ```
3. Alternatively, use **Docker Compose**:
   ```bash
   docker-compose up --build
   ```
4. The API is then available at [http://localhost:8000](http://localhost:8000).

---

## Directory Structure

```
.
├── Dockerfile
├── README.md
├── docker-compose.yml
├── logger_config.py
├── main.py
├── requirements.txt
├── services
│   ├── analysis
│   │   └── enrollment_analysis.py
│   ├── api
│   │   ├── advanced.py
│   │   ├── filtered_studies.py
│   │   └── routers
│   │       ├── enums.py
│   │       ├── enrollment_insights.py
│   │       ├── enrollment_stats.py
│   │       ├── enriched_studies.py
│   │       ├── geo_stats.py
│   │       ├── participant_flow.py
│   │       ├── search_areas.py
│   │       ├── sorted_studies.py
│   │       ├── stats_field_values.py
│   │       ├── stats_size.py
│   │       ├── studies.py
│   │       └── time_stats.py
│   ├── api_clients
│   │   └── clinical_trials_client.py
│   ├── data_processing
│   │   ├── data_cleaning.py
│   │   └── participant_flow.py
│   ├── utils
│   │   ├── error_handling.py
│   │   └── rate_limiting.py
│   ├── models.py
│   └── service.py
└── tests
    ├── test_api.py
    ├── test_service.py
    ├── ...
```

---

## API Endpoints & Example URLs

Below is a **brief** but **complete** list of important endpoints, how they might be used in your front end, and which functions they call internally.

### 1) Root Endpoint
- **GET /**
  - **Use Case**: Basic health check to verify the server is running.
  - **Example**: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
  - **Functions**: None beyond returning a JSON welcome message.

### 2) Filtered Studies Endpoints
- **GET /api/filtered-studies**
  - **Description**: Returns a list of studies filtered by advanced queries (condition, overall_status, etc.). Filter by multiple conditions simultaneously.
  - **Functions**:
    1. `check_rate_limit(client_ip)`
    2. `fetch_raw_data(...)`
    3. `clean_and_transform_data(...)`
  - **Example URLs**:
    - `[1] http://127.0.0.1:8000/api/filtered-studies?conditions=cancer&page_size=5`
    - `[2] http://127.0.0.1:8000/api/filtered-studies?conditions=cancer&conditions=diabetes&page_size=2`

### 3) Studies Endpoints
- **GET /api/studies/{nct_id}**
  - **Description**: Retrieve a single study by NCT ID (e.g. `NCT04000165`).
  - **Functions**:
    1. `check_rate_limit(client_ip)`
    2. `fetch_single_study(nct_id, fields)`
  - **Example URLs**:
    - `[1] http://127.0.0.1:8000/api/studies/NCT04000165`
    - `[2] http://127.0.0.1:8000/api/studies/NCT01234567?fields=protocolSection`

### 4) Participant Flow
- **GET /api/study-results/participant-flow/{nct_id}**
  - **Description**: Retrieves participant flow funnel (started, completed, dropped).
  - **Functions**:
    1. `check_rate_limit(client_ip)`
    2. `fetch_single_study(nct_id, fields=["protocolSection.resultsSection"])`
    3. `parse_participant_flow(resultsSection)`
  - **Example URLs**:
    - `[1] http://127.0.0.1:8000/api/study-results/participant-flow/NCT00587795`
    - `[2] http://127.0.0.1:8000/api/study-results/participant-flow/NCT04000165`

### 5) Enums & Search Areas
- **GET /api/enums**
  - **Description**: Returns possible enumerations (phases, statuses, etc.).
  - **Functions**:
    1. `check_rate_limit(client_ip)`
    2. `fetch_study_enums()`
  - **Example URLs**:
    - `[1] http://127.0.0.1:8000/api/enums`
    - `[2] http://127.0.0.1:8000/api/enums?someUnusedQuery=foo` (still returns the same data)

- **GET /api/search-areas**
  - **Description**: Returns search doc areas (BasicSearch, ConditionSearch, etc.).
  - **Functions**:
    1. `check_rate_limit(client_ip)`
    2. `fetch_search_areas()`
  - **Example URLs**:
    - `[1] http://127.0.0.1:8000/api/search-areas`
    - `[2] http://127.0.0.1:8000/api/search-areas?something=irrelevant`

### 6) Stats: Size & Field Values
- **GET /api/stats/size**
  - **Description**: Returns study size statistics, e.g. largest studies, average size.
  - **Functions**:
    1. `check_rate_limit(client_ip)`
    2. `fetch_study_sizes()`
  - **Example URLs**:
    - `[1] http://127.0.0.1:8000/api/stats/size`


- **GET /api/stats/field/values**
  - **Description**: Returns stats for a given set of fields. (For example, top values for Phase, Condition, etc.)
  - **Functions**:
    1. `check_rate_limit(client_ip)`
    2. `fetch_field_values(fields, field_types)`
  - **Example URLs**:
    - `[1] http://127.0.0.1:8000/api/stats/field/values?fields=Phase&field_types=ENUM`
    - `[2] http://127.0.0.1:8000/api/stats/field/values?fields=Condition`

### 7) Geo Stats
- **GET /api/geo-stats**
  - **Description**: Aggregates study locations by country, given lat/long radius.
  - **Functions**:
    1. `check_rate_limit(client_ip)`
    2. `fetch_raw_data(...)` with `distance(lat, long, radius)`
    3. Simple aggregator counting locations by country
  - **Example URLs**:
    - `[1] http://127.0.0.1:8000/api/geo-stats?condition=cancer&latitude=39.0035707&longitude=-77.1013313&radius=50mi&page_size=10`
    - `[2] http://127.0.0.1:8000/api/geo-stats?condition=diabetes&latitude=34.0522&longitude=-118.2437&radius=100mi`

### 8) Time Stats
- **GET /api/time-stats**
  - **Description**: For a given condition and starting year, aggregates how many studies have updated each year.
  - **Functions**:
    1. `check_rate_limit(client_ip)`
    2. `fetch_raw_data(...)` with advanced filter on `LastUpdatePostDate`
  - **Example URLs**:
    - `[1] http://127.0.0.1:8000/api/time-stats?condition=cancer&start_year=2020`
    - `[2] http://127.0.0.1:8000/api/time-stats?condition=heart disease&start_year=2022`

### 9) Enrollment Insights
- **GET /api/enrollment-insights**
  - **Description**: Fetches up to 100 “cancer” studies, cleans them, then uses `analyze_enrollment_data` for average/total distributions.
  - **Functions**:
    1. `check_rate_limit(client_ip)`
    2. `fetch_raw_data(condition="cancer")`
    3. `clean_and_transform_data(...)`
    4. `analyze_enrollment_data(...)`
  - **Example URLs**:
    - `[1] http://127.0.0.1:8000/api/enrollment-insights`
    - `[2] http://127.0.0.1:8000/api/enrollment-insights` (there are no optional params here)

### 10) Sorted Studies
- **GET /api/sorted-studies/multiple-fields**
  - **Description**: Allows multi-field sorting (e.g. by `enrollment_count` ascending, then `start_date` descending).
  - **Functions**:
    1. `check_rate_limit(client_ip)`
    2. `fetch_raw_data(sort=sort_params, page_size=..., page_token=...)`
    3. `clean_and_transform_data(...)`
  - **Example URLs**:
    - `[1] http://127.0.0.1:8000/api/sorted-studies/multiple-fields?sort_by=enrollment_count&sort_order=desc`
    - `[2] http://127.0.0.1:8000/api/sorted-studies/multiple-fields?sort_by=enrollment_count&sort_by=start_date&sort_order=asc&sort_order=desc`

### 11) Enriched Studies
- **GET /api/enriched-studies/multi-conditions**
  - **Description**: Retrieve studies filtered by multiple conditions, then enrich them with enrollment rates and condition aggregation.
  - **Functions**:
    1. `check_rate_limit(client_ip)`
    2. `fetch_raw_data(condition=...)`
    3. `clean_and_transform_data(...)`
    4. `calculate_enrollment_rates(...)`
    5. `aggregate_conditions(...)`
  - **Example URLs**:
    - `[1] http://127.0.0.1:8000/api/enriched-studies/multi-conditions?conditions=cancer&conditions=diabetes`
    - `[2] http://127.0.0.1:8000/api/enriched-studies/multi-conditions?conditions=heart%20disease&page_size=3`

1) Enrollment Stats
- **GET /api/enrollment-stats**
  - **Description**: Calculates and retrieves enrollment statistics across studies.
  - **Functions**:
    1. `check_rate_limit(client_ip)`
    2. `fetch_raw_data(condition="cancer", page_size=100, page_token=...)`
    3. `clean_and_transform_data(raw_data)`
    4. `pd.DataFrame(all_data)`
    5. `df['enrollment_count'].mean()`
    6. `df['enrollment_count'].median()`
    7. `df['enrollment_count'].quantile([...])`
    8. `df['enrollment_count'].value_counts(bins=10)`
  - **Example URLs**:
    - `[1] [http://127.0.0.1:8000/api/enrollment-stats](http://127.0.0.1:8000/api/enrollment-stats)`

---

## Testing

### 1) Install Test Dependencies
```bash
pip install -r requirements.txt
```

### 2) Run Tests
```bash
pytest
```
This will discover all tests in the `tests` directory (e.g. `test_api.py`, `test_service.py`, etc.).

---

---

## License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

```


---


