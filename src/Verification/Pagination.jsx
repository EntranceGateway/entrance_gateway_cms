import React from "react";

const Pagination = ({
  page,
  totalPages,
  onPageChange,
  className = "",
  labels = { prev: "Prev", next: "Next" },
  showNumbers = true,
}) => {
  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <nav
      className={`flex flex-wrap items-center justify-center gap-2 mt-6 ${className}`}
      aria-label="Pagination"
    >
      {/* Prev button */}
      <button
        onClick={handlePrev}
        disabled={page === 1}
        className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {labels.prev}
      </button>

      {/* Page numbers */}
      {showNumbers && (
        <span
          className="px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-900"
          aria-current="page"
        >
          {page} / {totalPages || 1}
        </span>
      )}

      {/* Next button */}
      <button
        onClick={handleNext}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {labels.next}
      </button>
    </nav>
  );
};

export default Pagination;
