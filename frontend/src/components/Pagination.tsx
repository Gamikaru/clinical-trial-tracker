import React from "react";

/**
 * Props for the Pagination component.
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Pagination component allows navigation through multiple pages of data.
 * @param currentPage - Current active page
 * @param totalPages - Total number of pages
 * @param onPageChange - Callback when page is changed
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Generate an array of page numbers
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Handle previous and next button clicks
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
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
