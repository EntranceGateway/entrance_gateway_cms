import api from "./index";

// --------------------------------------
// Get Admin Details (Current User)
// --------------------------------------
export const getAdmin = async (token) => {
  try {
    return await api.get("/api/v1/admin/getAdminDetails", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch admin details." };
  }
};

// --------------------------------------
// Get All Admins
// --------------------------------------
export const getAllAdmins = async (params = {}, token) => {
  try {
    return await api.get("/api/v1/admin/getAllAdmins", {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch admins." };
  }
};

// --------------------------------------
// Register New Admin (SUPER_ADMIN only)
// --------------------------------------
export const registerAdmin = async (data, token) => {
  try {
    return await api.post("/api/v1/auth/admin/register", data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to register admin." };
  }
};

// --------------------------------------
// Delete Admin (SUPER_ADMIN only)
// --------------------------------------
export const deleteAdmin = async (adminId, token) => {
  try {
    return await api.delete(`/api/v1/admin/deleteAdmin/${adminId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to delete admin." };
  }
};

// --------------------------------------
// Update Admin Role
// --------------------------------------
export const updateAdminRole = async (adminId, role, token) => {
  try {
    return await api.post(`/api/v1/admin/updateAdminRole/${adminId}?role=${role}`, {}, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to update admin role." };
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
