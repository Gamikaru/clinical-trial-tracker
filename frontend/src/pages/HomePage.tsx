/**
 * src/pages/HomePage.tsx
 *
 * The landing page with improved styling and a welcoming motion.
 */

import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <motion.div
      className="container mx-auto px-4 mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="card bg-base-100 shadow-md p-6 text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-neutral">
          Welcome to <span className="text-primary">TrialTracker</span>
        </h1>
        <p className="mb-6 text-lg text-gray-600">
          Explore clinical trial data, visualize insights, manage participants,
          and save  favorite trials.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/trials" className="btn btn-primary">
            View Trials
          </Link>
          <Link to="/dashboard" className="btn btn-secondary">
            Visualization Dashboard
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;
