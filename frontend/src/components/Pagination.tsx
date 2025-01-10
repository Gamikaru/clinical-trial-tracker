/**
 * src/components/Pagination.tsx
 *
 * A simpler numeric pagination with button animations (Framer Motion).
 */

import { motion } from "framer-motion";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Generate an array of page numbers [1...totalPages]
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center flex-wrap gap-2 mt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <button
        onClick={handlePrev}
        className="btn btn-sm btn-outline"
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`btn btn-sm ${
            page === currentPage ? "btn-primary" : "btn-outline"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={handleNext}
        className="btn btn-sm btn-outline"
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </motion.div>
  );
};

export default Pagination;
