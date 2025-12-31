import React, { useState } from "react";

/**
 * Pagination Component
 * 
 * Props:
 * - page: current page number
 * - totalPages: total number of pages
 * - onPageChange: callback when page changes
 * - className: optional extra classes
 * - labels: { prev: string, next: string }
 * - showNumbers: boolean to show page numbers
 * - fetchPage: optional async function to fetch data for a page (used in binary search)
 */
const Pagination = ({
  page,
  totalPages,
  onPageChange,
  className = "",
  labels = { prev: "Prev", next: "Next" },
  showNumbers = true,
  fetchPage, // optional backend fetch function
}) => {
  const [jumpPage, setJumpPage] = useState("");

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages && totalPages > 0) onPageChange(page + 1);
  };

  const handleJump = () => {
    const target = Number(jumpPage);
    if (!isNaN(target) && target >= 1 && target <= totalPages && totalPages > 0) {
      onPageChange(target);
      setJumpPage("");
    }
  };

  /**
   * Example binary search helper:
   * Finds which page contains a specific itemId using fetchPage.
   */
  const findItemPage = async (itemId) => {
    if (!fetchPage) {
      console.warn("fetchPage function not provided");
      return;
    }
    let left = 1,
      right = totalPages;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const items = await fetchPage(mid); // fetch items of page `mid`
      if (items.some((item) => item.id === itemId)) {
        onPageChange(mid);
        return mid;
      }
      if (itemId < items[0].id) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    return -1; // not found
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
        disabled={page === totalPages || totalPages === 0}
        className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {labels.next}
      </button>

      {/* Jump to page */}
      <div className="flex items-center gap-2 ml-4">
        <input
          type="number"
          min="1"
          max={totalPages}
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          className="w-16 px-2 py-1 border border-gray-300 rounded-md text-sm"
          placeholder="Page"
        />
        <button
          onClick={handleJump}
          className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Go
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
