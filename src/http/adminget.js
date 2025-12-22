import api from "./index";
// --------------------------------------
// Get Admin Details
// --------------------------------------
export const getAdmin = async (params = {}, token) => {
  try {
    return await api.get("/api/v1/admin/getAdminDetails", {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch admin details." };
  }
};
