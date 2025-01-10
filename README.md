# TrialTracker Frontend

## Project Overview

TrialTracker is the frontend component of a clinical trial management application. It allows users to view, manage, and visualize clinical trial data using public APIs. Built with React and TypeScript, the frontend emphasizes a user-friendly interface, data visualization with Chart.js, and responsive design using Tailwind CSS and DaisyUI.

## Technologies Used

- **React** (TypeScript)
- **Tailwind CSS** & **DaisyUI**
- **Axios** for API calls
- **Chart.js** for data visualization
- **React Router** for navigation
- **Vite** as the build tool

## Directory Structure

```plaintext
root@GMKRU:/home/gamikarudev/projects/fullstack/trial-tracker/frontend# tree -I "node*"
.
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── public
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── Dashboard.tsx
│   │   ├── Footer.tsx
│   │   ├── Login.tsx
│   │   ├── Navbar.tsx
│   │   ├── Pagination.tsx
│   │   └── ParticipantForm.tsx
│   ├── hooks
│   │   ├── useAuth.ts
│   │   ├── useEnums.ts
│   │   ├── useFieldSizes.ts
│   │   ├── useFieldValues.ts
│   │   ├── useSearchAreas.ts
│   │   ├── useStudies2.ts
│   │   ├── useStudy.ts
│   │   ├── useStudyStats.ts
│   │   ├── useTrialDetails.ts
│   │   ├── useTrialMetaData.ts
│   │   ├── useTrials.ts
│   │   └── useVersion.ts
│   ├── index.tsx
│   ├── pages
│   │   ├── HomePage.tsx
│   │   ├── ParticipantManagementPage.tsx
│   │   ├── SavedTrialsPage.tsx
│   │   ├── TrialDetailsPage.tsx
│   │   ├── TrialsPage.tsx
│   │   └── VisualizationDashboard.tsx
│   ├── services
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── requestHelper.ts
│   ├── styles
│   │   └── App.css
│   └── vite-env.d.ts
├── tailwind.config.js
├── test
│   └── App.test.tsx
├── tsconfig.json
└── vite.config.mjs

9 directories, 39 files
```

## Setup Instructions

1. **Install Dependencies**
    ```bash
    npm install
    ```

2. **Configure Environment Variables**

     Create a `.env` file in the `frontend` directory and set the API base URL:

     ```env
     VITE_API_URL=https://clinicaltrials.gov/api/v2
     ```

3. **Start Development Server**
    ```bash
    npm run dev
    ```

4. **Build & Preview**
    ```bash
    npm run build && npm run preview
    ```

     Open [http://localhost:3000](http://localhost:3000) to view the app in the browser.

## Features

- **Login** (placeholder, not yet implemented)
- **Trials Listing & Search**
- **Visual Dashboard** (Chart.js)
- **Add Participants** (placeholder, not yet implemented)
- **Saved Trials Management** (placeholder, not yet implemented)
- **Responsive UI** (Tailwind + DaisyUI)

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

MIT License

```
MIT License

© 2023 [Gavriel Rudolph](https://github.com/gavrielrudolph)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
