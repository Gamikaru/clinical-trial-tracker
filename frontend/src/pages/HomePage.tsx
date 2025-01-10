/**
 * src/pages/HomePage.tsx
 *
 * The app’s landing page. Provides an introduction and quick navigation.
 */

import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 mt-10">
      <div className="card bg-base-100 shadow-md p-6 text-center">
        <h1 className="text-3xl font-bold mb-4 text-primary">
          Welcome to TrialTracker
        </h1>
        <p className="mb-6">
          Explore clinical trial data, visualize insights, manage participants,
          and save your favorite trials.
        </p>
        <div className="space-x-4">
          <Link to="/trials" className="btn btn-primary">
            View Trials
          </Link>
          <Link to="/dashboard" className="btn btn-secondary">
            Visualization Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
