import React from "react";
import { Link } from "react-router-dom";

/**
 * Navbar component provides navigation links and user authentication controls.
 */
const Navbar: React.FC = () => {
//   const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar bg-base-200 shadow-md">
      <div className="container mx-auto px-4 flex justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          TrialTracker
        </Link>
        <div className="flex space-x-4">
          {/* {isAuthenticated ? ( */}
            <>
              <Link to="/dashboard" className="btn btn-ghost">
                Dashboard
              </Link>
              {/* <button onClick={logout} className="btn btn-ghost">
                Logout
              </button> */}
            </>
        {/* //   ) : (
            // <Link to="/login" className="btn btn-primary">
            //   Login
            // </Link>
          )} */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;