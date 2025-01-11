/**
 * src/App.tsx
 *
 * Main application component with React Router.
 */

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

// Import pages
import AdvancedSearchPage from "./pages/AdvancedSearchPage";
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

        {/* Main content area */}
        <main className="flex-grow py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/trials" element={<TrialsPage />} />
            <Route path="/trials/:id" element={<TrialDetailsPage />} />
            <Route path="/dashboard" element={<VisualizationDashboard />} />
            <Route path="/participants" element={<ParticipantManagementPage />} />
            {/* <Route path="/saved-trials" element={<SavedTrialsPage />} /> */}

            {/* (Optional) Advanced Search */}
            <Route path="/advanced-search" element={<AdvancedSearchPage />} />

            {/* Optionally, add a catch-all or redirect */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
