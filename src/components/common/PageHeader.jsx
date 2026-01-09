import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Standardized Page Header Component
 * @param {string} title - Page title
 * @param {Array} breadcrumbs - Array of { label, path }
 * @param {Array} actions - Array of actions { label, onClick, icon, variant }
 */
const PageHeader = ({ title, breadcrumbs = [], actions = [] }) => {
    return (
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                {/* Breadcrumbs */}
                {breadcrumbs.length > 0 && (
                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2 overflow-x-auto whitespace-nowrap pb-1">
                        <Link to="/" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                            <Home size={14} />
                            <span>Home</span>
                        </Link>
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={index}>
                                <ChevronRight size={14} className="text-gray-300" />
                                {crumb.path ? (
                                    <Link to={crumb.path} className="hover:text-indigo-600 transition-colors">
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="text-gray-900 font-medium">{crumb.label}</span>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                )}
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h1>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
                {actions.map((action, index) => {
                    const isPrimary = action.variant === "primary" || !action.variant;
                    const isDanger = action.variant === "danger";

                    return (
                        <button
                            key={index}
                            onClick={action.onClick}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                ${isPrimary
                                    ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md ring-indigo-500"
                                    : isDanger
                                        ? "bg-red-50 text-red-600 hover:bg-red-100 ring-red-500 border border-red-200"
                                        : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md ring-indigo-500 border border-gray-200"
                                }`}
                        >
                            {action.icon && <span>{action.icon}</span>}
                            {action.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default PageHeader;
