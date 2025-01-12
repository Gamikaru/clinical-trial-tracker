import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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

        {/* Hamburger Menu Icon */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              ></path>
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex md:space-x-4">
          <Link
            to="/trials"
            className="btn btn-ghost transition duration-300 ease-in-out transform hover:scale-105"
          >
            Trials
          </Link>
          <Link
            to="/dashboard"
            className="btn btn-ghost transition duration-300 ease-in-out transform hover:scale-105"
          >
            Dashboard
          </Link>
          <Link
            to="/geo-stats"
            className="btn btn-ghost transition duration-300 ease-in-out transform hover:scale-105"
          >
            Geo Stats
          </Link>

          <Link
            to="/participants"
            className="btn btn-ghost transition duration-300 ease-in-out transform hover:scale-105"
          >
            Participants
          </Link>
          {/* <Link to="/saved-trials" className="btn btn-ghost transition duration-300 ease-in-out transform hover:scale-105">
                        Saved
                    </Link> */}
          <Link
            to="/advanced-search"
            className="btn btn-ghost transition duration-300 ease-in-out transform hover:scale-105"
          >
            Advanced
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={toggleMenu}
          >
            <motion.div
              className="bg-white w-64 h-full shadow-lg"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col p-4 space-y-4">
                <Link
                  to="/trials"
                  className="btn btn-ghost"
                  onClick={toggleMenu}
                >
                  Trials
                </Link>
                <Link
                  to="/dashboard"
                  className="btn btn-ghost"
                  onClick={toggleMenu}
                >
                  Dashboard
                </Link>
                <Link
                  to="/participants"
                  className="btn btn-ghost"
                  onClick={toggleMenu}
                >
                  Participants
                </Link>
                {/* <Link to="/saved-trials" className="btn btn-ghost" onClick={toggleMenu}>
                                    Saved
                                </Link> */}
                <Link
                  to="/advanced-search"
                  className="btn btn-ghost"
                  onClick={toggleMenu}
                >
                  Advanced
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
