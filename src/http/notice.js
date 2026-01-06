import api from "./index";

// --------------------------------------
// Get All Notices (with pagination & sorting)
// --------------------------------------
export const getNotices = async (params = {}, token) => {
  try {
    return await api.get("/api/v1/notices", {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch notices." };
  }
};

// --------------------------------------
// Get Single Notice by ID
// --------------------------------------
export const getNoticeById = async (id, token) => {
  try {
    return await api.get(`/api/v1/notices/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch notice." };
  }
};

// --------------------------------------
// Create Notice
// --------------------------------------
export const createNotice = async (formData, token) => {
  try {
    return await api.post("/api/v1/notices", formData, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't manually set Content-Type for FormData - browser will set it with correct boundary
      },
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to create notice." };
  }
};

// --------------------------------------
// Update Notice
// --------------------------------------
export const updateNotice = async (id, formData, token) => {
  try {
    return await api.put(`/api/v1/notices/${id}`, formData, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't manually set Content-Type for FormData - browser will set it with correct boundary
      },
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to update notice." };
  }
};

// --------------------------------------
// Delete Notice
// --------------------------------------
export const deleteNotice = async (id, token) => {
  try {
    return await api.delete(`/api/v1/notices/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to delete notice." };
  }
};

// --------------------------------------
// Download Notice File/Image
// --------------------------------------
export const downloadNoticeFile = async (id, token) => {
  try {
    const response = await api.get(`/api/v1/notices/getNoticeFile/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      responseType: "blob",
    });
    return response;
  } catch (err) {
    throw err.response?.data || { error: "Failed to download notice file." };
  }
};

// --------------------------------------
// Get Notice File URL (for inline viewing)
// --------------------------------------
export const getNoticeFileUrl = (id) => {
  return `https://api.entrancegateway.com/api/v1/notices/getNoticeFile/${id}`;
};
