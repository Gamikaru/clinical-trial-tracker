/**
 * src/components/Footer.tsx
 *
 * An updated footer styled with a sleeker look reminiscent of Vial’s site.
 * Includes Framer Motion fade-in for a subtle reveal on component load.
 */

import { motion } from "framer-motion";
import React from "react";

const Footer: React.FC = () => {
  return (
    <motion.footer
      className="bg-gray-100 py-6 mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto text-center text-sm text-gray-600">
        <p>
          © {new Date().getFullYear()} <strong>TrialTracker</strong>. All rights
          reserved.
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
