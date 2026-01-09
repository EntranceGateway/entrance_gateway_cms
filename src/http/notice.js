import api from "./index";
import { handleApiError } from "./utils/errorHandler";

// --------------------------------------
// Get All Notices (with pagination & sorting)
// --------------------------------------
export const getNotices = async (params = {}) => {
  try {
    return await api.get("/api/v1/notices", { params });
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Get Single Notice by ID
// --------------------------------------
export const getNoticeById = async (id) => {
  try {
    return await api.get(`/api/v1/notices/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Create Notice
// --------------------------------------
export const createNotice = async (formData) => {
  try {
    return await api.post("/api/v1/notices", formData, {
      headers: {
        // Don't manually set Content-Type for FormData - browser will set it with correct boundary
      },
    });
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Update Notice
// --------------------------------------
export const updateNotice = async (id, formData) => {
  try {
    return await api.put(`/api/v1/notices/${id}`, formData, {
      headers: {
        // Don't manually set Content-Type for FormData - browser will set it with correct boundary
      },
    });
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Delete Notice
// --------------------------------------
export const deleteNotice = async (id) => {
  try {
    return await api.delete(`/api/v1/notices/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Download Notice File/Image
// --------------------------------------
export const downloadNoticeFile = async (id) => {
  try {
    const response = await api.get(`/api/v1/notices/${id}/file`, {
      responseType: "blob",
    });
    return response;
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Get Notice File URL (for inline viewing)
// --------------------------------------
export const getNoticeFileUrl = (id) => {
  return `https://api.entrancegateway.com/api/v1/notices/${id}/file`;
};
