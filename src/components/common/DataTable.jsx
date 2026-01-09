import React, { useState } from "react";
import { ChevronUp, ChevronDown, MoreHorizontal } from "lucide-react";

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
            <div className="w-full space-y-4 animate-pulse">
                <div className="h-10 bg-gray-100 rounded-lg"></div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-50 rounded-lg"></div>
                ))}
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <div className="text-gray-400 mb-2">
                    <MoreHorizontal size={48} />
                </div>
                <p className="text-gray-500 font-medium">{emptyMessage}</p>
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
                                    className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${col.sortable ? "cursor-pointer hover:bg-gray-100 transition-colors" : ""
                                        }`}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {col.sortable && (
                                            <div className="flex flex-col">
                                                <ChevronUp
                                                    size={12}
                                                    className={`${sortConfig.key === col.key && sortConfig.direction === "asc"
                                                            ? "text-indigo-600"
                                                            : "text-gray-300"
                                                        }`}
                                                />
                                                <ChevronDown
                                                    size={12}
                                                    className={`${sortConfig.key === col.key && sortConfig.direction === "desc"
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
                                    <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
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
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => onPageChange?.(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages - 1}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{pagination.currentPage * pagination.pageSize + 1}</span> to{" "}
                                <span className="font-medium">
                                    {Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalItems)}
                                </span>{" "}
                                of <span className="font-medium">{pagination.totalItems}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                {/* Simplified page numbers logic */}
                                {[...Array(pagination.totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => onPageChange?.(i)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pagination.currentPage === i
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
