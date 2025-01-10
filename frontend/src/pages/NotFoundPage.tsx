/**
 * src/pages/NotFoundPage.tsx
 *
 * A simple 404 page with a minimal style.
 */

import { motion } from "framer-motion";
import React from "react";

const NotFoundPage: React.FC = () => {
  return (
    <motion.div
      className="text-center mt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl text-gray-500 mt-2">Page Not Found</p>
    </motion.div>
  );
};

export default NotFoundPage;
