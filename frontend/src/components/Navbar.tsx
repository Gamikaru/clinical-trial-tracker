/**
 * src/components/Navbar.tsx
 *
 * A top nav bar with a minimal, modern aesthetic. Includes small motion effects.
 */

import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <motion.nav
      className="bg-white shadow-md z-10 sticky top-0"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo / Brand Name */}
        <Link to="/" className="text-2xl font-bold text-neutral">
          TrialTracker
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-4">
          <Link to="/trials" className="btn btn-ghost">
            Trials
          </Link>
          <Link to="/dashboard" className="btn btn-ghost">
            Dashboard
          </Link>
          <Link to="/participants" className="btn btn-ghost">
            Participants
          </Link>
          <Link to="/saved-trials" className="btn btn-ghost">
            Saved
          </Link>
          <Link to="/advanced-search" className="btn btn-ghost">
            Advanced
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
