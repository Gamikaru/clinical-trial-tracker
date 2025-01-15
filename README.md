
# TrialTracker: Full-Stack Clinical Trials Explorer

TrialTracker is a full-stack application composed of a **React + TypeScript** front-end and a **FastAPI** Python back-end. Together, they provide a robust platform to visualize and explore public clinical trial data through advanced filtering, searching, and data visualization.

---

## Overview

- **Front-End**: A React application built with TypeScript, TailwindCSS, DaisyUI, and Chart.js. It provides a user interface for exploring and visualizing clinical trial data.
- **Back-End**: A FastAPI service that fetches, cleans, and serves data from [ClinicalTrials.gov API v2](https://clinicaltrials.gov/api/v2). It adds advanced filtering, caching, rate limiting, and data analysis features to support the front-end.

The front-end now communicates exclusively with our FastAPI back-end, which intermediates all data interactions, ensuring a clean separation between UI and data handling.

---

## Motivation

- **Front-End**: Created to practice data visualization, advanced search, and TypeScript development by visualizing trial datasets.
- **Back-End**: Built to handle API interactions, data cleaning, and serve enriched endpoints tailored for the front-end, while adding performance and security features like caching and rate limiting.

---

## Technologies Used

### Front-End
- **React** (TypeScript)
- **Tailwind CSS** & **DaisyUI**
- **Axios** for API calls
- **Chart.js** for data visualization
- **React Router** for navigation
- **Vite** as the build tool
- **Framer Motion** for animated transitions & effects

### Back-End
- **FastAPI** for API framework
- **Python 3.10+**
- **Pandas** for data manipulation & analysis
- **Loguru** for logging
- **Docker** & **Docker Compose** for containerization
- **requests-cache** for caching
- **Pytest** for testing

---

## Directory Structure

```plaintext
.
├── frontend
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── public
│   ├── src
│   │   ├── App.tsx
│   │   ├── components
│   │   ├── hooks
│   │   ├── index.tsx
│   │   ├── pages
│   │   ├── services
│   │   ├── styles
│   │   ├── types
│   │   ├── utils
│   │   └── vite-env.d.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.mjs
├── backend
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── logger_config.py
│   ├── main.py
│   ├── requirements.txt
│   ├── services
│   └── tests
└── README.md  (this file)
```

*Note: The directory structure above abstracts the separation between front-end and back-end folders.*

---

## Setup Instructions

### 1. Front-End Setup

1. **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```

3. **Configure Environment Variables**

    Create a `.env` file in the `frontend` directory and set the API base URL to point to your local FastAPI backend:
    ```env
    VITE_API_URL=http://127.0.0.1:8000/api
    ```

4. **Start Development Server**
    ```bash
    npm run dev
    ```

5. **Build & Preview**
    ```bash
    npm run build && npm run preview
    ```

### 2. Back-End Setup

#### Prerequisites
- **Python 3.10+**
- Optionally, **Docker** for container-based deployment

#### Local Installation (Without Docker)

1. **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

2. **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3. **Run the FastAPI app:**
    ```bash
    python main.py
    ```

4. The API is now available at [http://127.0.0.1:8000](http://127.0.0.1:8000).

#### Run with Docker

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

4. The API will be available at [http://localhost:8000](http://localhost:8000).

---

## Front-End Features

- **Login** (placeholder, not yet implemented)
- **Trials Listing & Search**
- **Visual Dashboard** powered by Chart.js
- **Add Participants** (placeholder, not yet implemented)
- **Saved Trials Management** (placeholder, not yet implemented)
- **Responsive UI** with Tailwind CSS & DaisyUI

### Styling

- **Tailwind CSS:** Utility-first CSS framework for rapid styling.
- **DaisyUI:** Pre-designed UI components for consistency and speed.

### API Integration (Updated)

The front-end now communicates with the custom FastAPI back-end. All API requests are routed through Axios calls configured in `src/services/api.ts` pointing to `VITE_API_URL`. This ensures the front-end is decoupled from direct access to external APIs, relying instead on our tailored back-end endpoints.

### Testing Front-End

Run tests using:
```bash
npm test
```

---

## Back-End Features

- **Advanced Filtering:** Filter studies by condition, status, location, etc.
- **Search Areas:** Retrieve enumerations, search docs, and metadata.
- **Caching:** Accelerate repeated requests using `requests-cache`.
- **Rate Limiting:** Protect API endpoints with a token-bucket algorithm.
- **Logging:** Comprehensive logging with Loguru.
- **Docker & Docker Compose:** Containerization for deployment.
- **Pytest Tests:** Automated unit & integration tests.
- **Pandas Integration:** Data analysis and manipulation tools.

---

## API Endpoints & Example URLs

The FastAPI back-end exposes numerous endpoints for filtering studies, retrieving statistics, and more. For a detailed list of endpoints, their descriptions, and example URLs, please refer to the [Back-End README](#) or browse the source in the `backend/services/api` directory.

*(Key endpoints include `/api/filtered-studies`, `/api/studies/{nct_id}`, `/api/enums`, `/api/stats/size`, and many others detailed in the original back-end documentation.)*

---

## Testing Back-End

1. **Install Test Dependencies** (if not already installed):
    ```bash
    pip install -r requirements.txt
    ```

2. **Run Tests**:
    ```bash
    pytest
    ```
   This will discover and run all tests in the `tests` directory of the back-end.

---

## License

### Front-End License
```text
MIT License

© 2023 [Gavriel Rudolph](https://github.com/Gamikaru)

... (full MIT license text)
```

### Back-End License
This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

*This project is a personal test build. Data and code are for demonstration purposes only.*
```
