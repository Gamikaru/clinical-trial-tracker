import React from "react";

/**
 * Footer component displays the application's footer information.
 */
const Footer: React.FC = () => {
  return (
    <footer className="footer footer-center p-4 bg-base-200 text-base-content">
      <div>
        <p>© {new Date().getFullYear()} TrialTracker. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
