/**
 * Centralized Badge Color System
 * Follows the visual language defined in DESIGN_SYSTEM.md
 */
export const BADGE_VARIANTS = {
  // Semantic Colors
  subject: "bg-purple-50 text-purple-700 border-purple-200",
  course: "bg-emerald-50 text-emerald-700 border-emerald-200",
  code: "bg-indigo-50 text-indigo-700 border-indigo-200",
  affiliation: "bg-blue-50 text-blue-700 border-blue-200",
  semester: "bg-amber-50 text-amber-700 border-amber-200",
  year: "bg-gray-100 text-gray-700 border-gray-200",

  // Status Colors
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactive: "bg-gray-100 text-gray-600 border-gray-200",
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",

  // Action Colors
  create: "bg-green-50 text-green-700 border-green-200",
  update: "bg-blue-50 text-blue-700 border-blue-200",
  delete: "bg-red-50 text-red-700 border-red-200",

  // Fallback
  default: "bg-gray-100 text-gray-700 border-gray-200",
};
