import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

/**
 * Reusable Data Table Component
 * @param {Array} data - Array of objects to display
 * @param {Array} columns - Array of column definitions: { key: string, label: string, sortable?: boolean, render?: (row) => ReactNode }
 * @param {boolean} loading - Loading state
 * @param {Object} pagination - Pagination info: { currentPage, totalPages, totalItems, pageSize }
 * @param {Function} onPageChange - Callback for page changes
 * @param {Function} onSort - Callback for sorting: (key, direction) => void
 * @param {string} emptyMessage - Message to show when no data
 */
const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  pagination = null,
  onPageChange,
  onSort,
  emptyMessage = "No data found",
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    onSort?.(key, direction);
  };

  if (loading) {
    return (
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* Header Skeleton */}
        <div className="h-12 bg-gray-50 border-b border-gray-100 flex items-center px-6">
          <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
        </div>
        {/* Rows Skeleton */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 border-b border-gray-50 flex items-center px-6 gap-6 last:border-0"
          >
            <div className="h-4 bg-gray-100 rounded w-1/6 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-1/4 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-1/5 animate-pulse" />
            <div className="flex-1" />
            <div className="h-8 bg-gray-100 rounded w-20 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-gray-700 font-semibold text-lg mb-1">
          {emptyMessage}
        </p>
        <p className="text-gray-400 text-sm">
          Try adjusting your filters or add new content
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                    col.sortable
                      ? "cursor-pointer hover:bg-gray-100 transition-colors"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp
                          size={12}
                          className={`${
                            sortConfig.key === col.key &&
                            sortConfig.direction === "asc"
                              ? "text-indigo-600"
                              : "text-gray-300"
                          }`}
                        />
                        <ChevronDown
                          size={12}
                          className={`${
                            sortConfig.key === col.key &&
                            sortConfig.direction === "desc"
                              ? "text-indigo-600"
                              : "text-gray-300"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((row, idx) => (
              <tr
                key={row.id || row._id || idx}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination component can be added here or passed as child */}
      {pagination && (
        <div className="mt-4 flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl sm:px-6 shadow-sm">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange?.(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 0}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange?.(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages - 1}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {pagination.totalItems > 0
                    ? pagination.currentPage * pagination.pageSize + 1
                    : 0}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    (pagination.currentPage + 1) * pagination.pageSize,
                    pagination.totalItems
                  )}
                </span>{" "}
                of <span className="font-medium">{pagination.totalItems}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {/* Simplified page numbers logic */}
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => onPageChange?.(i)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      pagination.currentPage === i
                        ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
