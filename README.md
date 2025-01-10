# TrialTracker Frontend

## Project Overview

TrialTracker is the frontend component of a clinical trial management dashboard application. It allows users to view, manage, and visualize clinical trial data using public clinical trial data APIs. Built with React and TypeScript, the frontend emphasizes a user-friendly interface, data visualization with Chart.js, and responsive design using Tailwind CSS and DaisyUI components.

## Technologies Used

- **React** with **TypeScript**
- **Tailwind CSS** and **DaisyUI** for styling
- **Axios** for API calls
- **Chart.js** for data visualization
- **React Router** for navigation
- **Vite** as the build tool

## Directory Structure

```
.
├── index.html
├── package-lock.json
├── package.json
├── public
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── Login.tsx
│   │   ├── ParticipantForm.tsx
│   │   ├── TrialDashboard.tsx
│   │   └── TrialDetails.tsx
│   ├── hooks
│   │   └── useTrials.ts
│   ├── index.tsx
│   ├── services
│   │   └── api.ts
│   ├── styles
│   │   └── App.css
│   └── vite-env.d.ts
├── tailwind.config.js
├── test
│   └── App.test.tsx
├── tsconfig.json
└── vite.config.mjs
```

## Setup Instructions

1. **Install Dependencies**

    Navigate to the `frontend` directory and run:

    ```bash
    npm install
    ```

2. **Configure Environment Variables**

    Create a `.env` file in the `frontend` directory and set the API base URL:

    ```env
    REACT_APP_API_URL=http://localhost:5000/api/v1
    ```

3. **Start Development Server**

    ```bash
    npm start
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the app in the browser.

## Features

- **Login:** Authenticate users using JWT.
- **Trial Dashboard:** Display a list of clinical trials fetched from the public API.
- **Trial Details:** View detailed information about a specific trial.
- **Participant Management:** Add and manage participants in trials.
- **Data Visualization:** Visualize trial enrollment data using charts.

## Styling

- **Tailwind CSS:** Utility-first CSS framework for rapid styling.
- **DaisyUI:** Pre-designed UI components for consistency and speed.

## API Integration

Uses the public clinical trial data API to fetch and manage trial data. Axios is configured in `src/services/api.ts` to handle API requests and include JWT tokens for authenticated routes.

## Testing

Run tests using:

```bash
npm test
```

## License

[MIT](LICENSE)
```