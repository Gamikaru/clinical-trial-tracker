/**
 * src/App.tsx
 *
 * Main application with routes to the various pages.
 */
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";

// Import pages
import AdvancedSearchPage from "./pages/AdvancedSearchPage";
import GeoStatsDashboard from "./pages/GeoStatsDashboard";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ParticipantManagementPage from "./pages/ParticipantManagementPage";
import TrialDetailsPage from "./pages/TrialDetailsPage";
import TrialsPage from "./pages/TrialsPage";
import VisualizationDashboard from "./pages/VisualizationDashboard";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/trials" element={<TrialsPage />} />
            <Route path="/trials/:id" element={<TrialDetailsPage />} />
            <Route path="/dashboard" element={<VisualizationDashboard />} />
            <Route path="/geo-stats" element={<GeoStatsDashboard />} />
            <Route path="/participants" element={<ParticipantManagementPage />} />
            <Route path="/advanced-search" element={<AdvancedSearchPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
