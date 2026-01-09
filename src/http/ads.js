import api from "./index";
import { handleApiError } from "./utils/errorHandler";

// --------------------------------------
// Get All Ads (with pagination)
// --------------------------------------
export const getAds = async (params = {}) => {
  try {
    return await api.get("/api/v1/ads", { params });
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Create Ad
// --------------------------------------
export const createAd = async (formData) => {
  try {
    return await api.post("/api/v1/ads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Update Ad
// --------------------------------------
export const updateAd = async (id, formData) => {
  try {
    return await api.put(`/api/v1/ads/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Delete Ad
// --------------------------------------
export const deleteAd = async (id) => {
  try {
    return await api.delete(`/api/v1/ads/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};
