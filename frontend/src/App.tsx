import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ParticipantForm from "./components/ParticipantForm";
import TrialDashboard from "./components/TrialDashboard";
import TrialDetails from "./components/TrialDetails";

/**
 * App component sets up routing and layout.
 */
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <main className="flex-grow py-8">
          <Routes>
            <Route path="/" element={<TrialDashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trials/:id" element={<TrialDetails />} />
            <Route path="/participant-form" element={<ParticipantForm />} />
            {/* Redirect any unknown routes to home */}
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
