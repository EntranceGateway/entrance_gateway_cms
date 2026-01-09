import React from "react";

/**
 * Standardized Loading State (Skeleton) Component
 * @param {string} type - "table" | "card" | "form"
 * @param {number} count - number of items to show
 */
const LoadingState = ({ type = "table", count = 5 }) => {
    if (type === "table") {
        return (
            <div className="w-full space-y-4">
                {/* Table Header Skeleton */}
                <div className="h-12 bg-gray-100 rounded-xl w-full animate-pulse"></div>
                {/* Table Body Skeleton */}
                {[...Array(count)].map((_, i) => (
                    <div key={i} className="flex gap-4 p-4 border border-gray-100 rounded-xl animate-pulse">
                        <div className="h-6 bg-gray-50 rounded w-1/4"></div>
                        <div className="h-6 bg-gray-50 rounded w-1/4"></div>
                        <div className="h-6 bg-gray-50 rounded w-1/4"></div>
                        <div className="h-6 bg-gray-50 rounded w-1/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (type === "card") {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(count)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm animate-pulse space-y-4">
                        <div className="h-40 bg-gray-50 rounded-xl"></div>
                        <div className="h-6 bg-gray-100 rounded w-3/4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-50 rounded w-full"></div>
                            <div className="h-4 bg-gray-50 rounded w-2/3"></div>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                            <div className="h-8 bg-gray-100 rounded w-20"></div>
                            <div className="h-8 bg-gray-100 rounded w-24"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (type === "form") {
        return (
            <div className="max-w-4xl mx-auto space-y-8 p-8 bg-white rounded-2xl shadow-sm border border-gray-100 animate-pulse">
                <div className="space-y-6">
                    <div className="h-8 bg-gray-100 rounded w-1/3"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 bg-gray-50 rounded w-1/4"></div>
                                <div className="h-10 bg-gray-50 rounded w-full"></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex gap-4 pt-4">
                    <div className="h-12 bg-gray-50 rounded flex-1"></div>
                    <div className="h-12 bg-gray-100 rounded flex-1"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );
};

export default LoadingState;
