/**
 * src/App.tsx
 *
 * Main application component. Defines routes and includes the Navbar and Footer.
 * Uses React Router for navigation among the pages.
 */

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

// Import pages
import HomePage from "./pages/HomePage";
import ParticipantManagementPage from "./pages/ParticipantManagementPage";
import SavedTrialsPage from "./pages/SavedTrialsPage";
import TrialDetailsPage from "./pages/TrialDetailsPage";
import TrialsPage from "./pages/TrialsPage";
import VisualizationDashboard from "./pages/VisualizationDashboard";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Top Navbar */}
        <Navbar />

        {/* Main content area */}
        <main className="flex-grow py-8">
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<HomePage />} />

            {/* Trials List/Search Page */}
            <Route path="/trials" element={<TrialsPage />} />

            {/* Detailed View of a Specific Trial */}
            <Route path="/trials/:id" element={<TrialDetailsPage />} />

            {/* Visualization Dashboard (Charts & Stats) */}
            <Route path="/dashboard" element={<VisualizationDashboard />} />

            {/* Participant Management */}
            <Route
              path="/participants"
              element={<ParticipantManagementPage />}
            />

            {/* Saved Trials (Bookmarks) */}
            <Route path="/saved-trials" element={<SavedTrialsPage />} />

            {/* Optionally, add a catch-all route or redirect if needed */}
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
