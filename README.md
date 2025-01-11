
# TrialTracker

This is a rough work-in-progress front-end to visualize and explore public clinical trial data. The app uses React, TypeScript, TailwindCSS, DaisyUI, and Chart.js. It’s being published for demonstration, with many planned features still unfinished.

## Motivation
• Created to practice data visualization and searching across trial datasets using Typescript

## Current Structure
• Organized into /src/components, /src/hooks, /src/pages, and /services for modular development.
• Incorporates charts, a dashboard, advanced search (not yet working), and a minimal participant manager login portal (unconnected).

## Planned Enhancements
• Expand chart coverage for more data points.
• Better error handling and performance optimizations.
• Additional filtering and search logic for more detailed trial data.

#### I have built out some of the backend as this project was originally intended to be a full-stack application. However, I have decided to focus on the front-end, utilizing the public API provided by the clinical trial data source for now.
---
This project is only a personal test build. Data and code are for demonstration.

## Technologies Used

- **React** (TypeScript)
- **Tailwind CSS** & **DaisyUI**
- **Axios** for API calls
- **Chart.js** for data visualization
- **React Router** for navigation
- **Vite** as the build tool
- **Framer** for animated transitions & effects

## Directory Structure

```plaintext
.
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── public
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── Footer.tsx
│   │   ├── Login.tsx
│   │   ├── MetadataFields.tsx
│   │   ├── Navbar.tsx
│   │   ├── StudyMetadataTable.tsx
│   │   ├── StudyStatistics.tsx
│   │   ├── SummaryCard.tsx
│   │   ├── SummaryCards.tsx
│   │   ├── TopConditionsChart.tsx
│   │   └── TrialsByStatusChart.tsx
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
│   │   ├── AdvancedSearchPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── NotFoundPage.tsx
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
│   ├── types
│   │   └── index.ts
│   ├── utils
│   │   └── metadataDescriptions.ts
│   └── vite-env.d.ts
├── tailwind.config.js
├── test
│   └── App.test.tsx
├── tsconfig.json
└── vite.config.mjs

11 directories, 47 files
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

Uses this [public clinical trial data API](https://clinicaltrials.gov/data-api/about-api/study-data-structure#intro
) to fetch and manage trial data. Axios is configured in `src/services/api.ts` to handle API requests and include JWT tokens for authenticated routes



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
