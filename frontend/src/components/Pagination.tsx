/**
 * src/components/Pagination.tsx
 *
 * A simple numeric pagination component to demonstrate how you might navigate
 * through pages of results. Can be replaced with "Load More" or nextPageToken approach.
 */

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
    <div className="flex justify-center items-center space-x-2 mt-6">
      <button
        onClick={handlePrev}
        className="btn btn-ghost"
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {/* Page number buttons */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`btn btn-ghost ${
            page === currentPage ? "btn-active" : ""
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={handleNext}
        className="btn btn-ghost"
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
