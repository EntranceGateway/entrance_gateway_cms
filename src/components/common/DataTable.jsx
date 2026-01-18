import React, { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

/**
 * Professional Production-Ready Data Table Component
 * 
 * Features:
 * - Strong visual hierarchy with sticky headers
 * - Zebra striping and hover states
 * - Left-aligned text, right-aligned numbers
 * - Consistent typography and spacing
 * - Built-in sorting with visual indicators
 * - Responsive with horizontal scroll
 * - Accessible with semantic HTML and keyboard navigation
 * - Loading skeleton and empty states
 * - Optimized pagination
 * 
 * @param {Array} data - Array of objects to display
 * @param {Array} columns - Column definitions: { 
 *   key: string, 
 *   label: string, 
 *   sortable?: boolean, 
 *   align?: 'left'|'right'|'center',
 *   render?: (row) => ReactNode 
 * }
 * @param {boolean} loading - Loading state
 * @param {Object} pagination - { currentPage, totalPages, totalItems, pageSize }
 * @param {Function} onPageChange - Page change callback
 * @param {Function} onSort - Sort callback: (key, direction) => void
 * @param {Function} onRowClick - Row click callback
 * @param {string} emptyMessage - Empty state message
 * @param {ReactNode} emptyIcon - Custom empty state icon
 */
const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  pagination = null,
  onPageChange,
  onSort,
  onRowClick,
  emptyMessage = "No data found",
  emptyIcon = null,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    if (!key) return;
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    onSort?.(key, direction);
  };

  // Loading State - Skeleton
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  >
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...Array(5)].map((_, rowIdx) => (
                <tr key={rowIdx} className="bg-white">
                  {columns.map((_, colIdx) => (
                    <td key={colIdx} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Empty State
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex flex-col items-center justify-center p-12 text-center">
          {emptyIcon || (
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
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
          )}
          <p className="text-gray-700 font-semibold text-base mb-1">
            {emptyMessage}
          </p>
          <p className="text-gray-500 text-sm">
            Try adjusting your filters or search criteria
          </p>
        </div>
      </div>
    );
  }

  // Main Table
  return (
    <div className="w-full">
      {/* Table Container with Horizontal Scroll */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            {/* Header with Sticky Positioning */}
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr role="row">
                {columns.map((col) => {
                  const align = col.align || 'left';
                  const textAlign = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
                  const isSorted = sortConfig.key === col.key;
                  
                  return (
                    <th
                      key={col.key}
                      role="columnheader"
                      aria-sort={
                        isSorted
                          ? sortConfig.direction === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                      onClick={() => col.sortable && handleSort(col.key)}
                      className={`px-4 py-3 ${textAlign} text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap ${
                        col.sortable
                          ? "cursor-pointer select-none hover:bg-gray-100 transition-colors"
                          : ""
                      }`}
                    >
                      <div className={`flex items-center gap-1.5 ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'}`}>
                        <span>{col.label}</span>
                        {col.sortable && (
                          <div className="flex items-center">
                            {!isSorted ? (
                              <ChevronsUpDown size={14} className="text-gray-400" />
                            ) : sortConfig.direction === "asc" ? (
                              <ChevronUp size={14} className="text-indigo-600" />
                            ) : (
                              <ChevronDown size={14} className="text-indigo-600" />
                            )}
                          </div>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Body with Zebra Striping */}
            <tbody className="divide-y divide-gray-100" role="rowgroup">
              {data.map((row, idx) => (
                <tr
                  key={row.id || row._id || idx}
                  role="row"
                  onClick={() => onRowClick?.(row)}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onRowClick(row);
                    }
                  }}
                  className={`transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  } ${
                    onRowClick
                      ? 'cursor-pointer hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {columns.map((col) => {
                    const align = col.align || 'left';
                    const textAlign = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
                    
                    return (
                      <td
                        key={col.key}
                        role="cell"
                        className={`px-4 py-3 text-sm ${textAlign}`}
                      >
                        {col.render ? col.render(row) : (
                          <span className={align === 'right' ? 'font-medium text-gray-900' : 'text-gray-700'}>
                            {row[col.key] ?? '-'}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination && pagination.totalPages > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            {/* Results Info */}
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium text-gray-900">
                {pagination.totalItems > 0
                  ? pagination.currentPage * pagination.pageSize + 1
                  : 0}
              </span>{" "}
              to{" "}
              <span className="font-medium text-gray-900">
                {Math.min(
                  (pagination.currentPage + 1) * pagination.pageSize,
                  pagination.totalItems
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-900">
                {pagination.totalItems}
              </span>{" "}
              results
            </div>

            {/* Page Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange?.(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 0}
                aria-label="Previous page"
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Previous
              </button>
              
              <span className="text-sm text-gray-600">
                Page{" "}
                <span className="font-medium text-gray-900">
                  {pagination.currentPage + 1}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">
                  {pagination.totalPages}
                </span>
              </span>

              <button
                onClick={() => onPageChange?.(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages - 1}
                aria-label="Next page"
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
