import React from "react";
import { AlertTriangle, X } from "lucide-react";

/**
 * Standardized Confirmation Modal
 * @param {boolean} isOpen - Modal visibility
 * @param {string} title - Modal title
 * @param {string} message - Confirmation message
 * @param {string} confirmText - Label for confirm button
 * @param {string} cancelText - Label for cancel button
 * @param {string} variant - "danger" | "warning" | "info"
 * @param {boolean} loading - Loading state for confirm button
 * @param {Function} onConfirm - Success callback
 * @param {Function} onCancel - Cancel callback
 */
const ConfirmModal = ({
    isOpen,
    title = "Confirm Action",
    message = "Are you sure you want to proceed? This action may be irreversible.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
    loading = false,
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;

    const themes = {
        danger: {
            button: "bg-red-600 hover:bg-red-700 ring-red-500",
            icon: "bg-red-100 text-red-600",
            text: "text-red-600",
        },
        warning: {
            button: "bg-amber-600 hover:bg-amber-700 ring-amber-500",
            icon: "bg-amber-100 text-amber-600",
            text: "text-amber-600",
        },
        info: {
            button: "bg-indigo-600 hover:bg-indigo-700 ring-indigo-500",
            icon: "bg-indigo-100 text-indigo-600",
            text: "text-indigo-600",
        },
    };

    const theme = themes[variant] || themes.danger;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                onClick={onCancel}
            />

            {/* Modal Container */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${theme.icon}`}>
                            <AlertTriangle size={24} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                                <button
                                    onClick={onCancel}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <p className="text-gray-600 leading-relaxed">{message}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`w-full sm:w-auto px-6 py-2.5 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${theme.button}`}
                    >
                        {loading ? "Processing..." : confirmText}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="w-full sm:w-auto px-6 py-2.5 text-gray-700 font-semibold bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:shadow shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
