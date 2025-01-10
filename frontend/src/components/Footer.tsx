/**
 * src/components/Footer.tsx
 *
 * Simple footer with potential contact info and references.
 */

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-base-200 py-4 mt-10">
      <div className="container mx-auto text-center text-sm">
        <p>© {new Date().getFullYear()} TrialTracker. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
