import api from "./index";
import { handleApiError } from "./utils/errorHandler";

// --------------------------------------
// Get Admin Details (Current User)
// --------------------------------------
export const getAdmin = async () => {
  try {
    return await api.get("/api/v1/admin/me");
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Get All Admins
// --------------------------------------
export const getAllAdmins = async (params = {}) => {
  try {
    return await api.get("/api/v1/admin/allAdmins", { params });
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Register New Admin (SUPER_ADMIN only)
// --------------------------------------
export const registerAdmin = async (data) => {
  try {
    return await api.post("/api/v1/auth/admin/register", data);
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Delete Admin (SUPER_ADMIN only)
// --------------------------------------
export const deleteAdmin = async (email) => {
  try {
    return await api.delete("/api/v1/admin", {
      data: { email },
    });
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Update Admin Role
// --------------------------------------
export const updateAdminRole = async (adminId, role) => {
  try {
    return await api.post(`/api/v1/admin/updateAdminRole/${adminId}?role=${role}`, {});
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Update Admin Details (SUPER_ADMIN only)
// --------------------------------------
export const updateAdminDetails = async (data) => {
  try {
    return await api.put("/api/v1/admin/", data);
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Admin Roles
// --------------------------------------
export const ADMIN_ROLES = [
  { value: "SUPER_ADMIN", label: "Super Admin", color: "bg-purple-100 text-purple-800" },
  { value: "ADMIN", label: "Admin", color: "bg-blue-100 text-blue-800" },
  { value: "USER", label: "User", color: "bg-gray-100 text-gray-800" },
  { value: "TRAINER", label: "Trainer", color: "bg-green-100 text-green-800" },
  { value: "MODERATOR", label: "Moderator", color: "bg-yellow-100 text-yellow-800" },
  { value: "CONTENT_CREATOR", label: "Content Creator", color: "bg-pink-100 text-pink-800" },
  { value: "ANALYST", label: "Analyst", color: "bg-indigo-100 text-indigo-800" },
  { value: "SUPPORT_AGENT", label: "Support Agent", color: "bg-orange-100 text-orange-800" },
  { value: "GUEST", label: "Guest", color: "bg-gray-100 text-gray-600" },
];
