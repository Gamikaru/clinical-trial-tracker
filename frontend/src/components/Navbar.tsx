/**
 * src/components/Navbar.tsx
 *
 * A simple top navigation bar linking to the main pages.
 */

import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar bg-base-200 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo / Brand Name */}
        <Link to="/" className="text-2xl font-bold text-primary">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
