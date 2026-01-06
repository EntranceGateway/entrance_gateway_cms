import api from "./index";

// --------------------------------------
// Get All Ads (with pagination)
// --------------------------------------
export const getAds = async (params = {}, token) => {
  try {
    return await api.get("/api/v1/ads", {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch ads." };
  }
};

// --------------------------------------
// Create Ad
// --------------------------------------
export const createAd = async (formData, token) => {
  try {
    return await api.post("/api/v1/ads", formData, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to create ad." };
  }
};

// --------------------------------------
// Update Ad
// --------------------------------------
export const updateAd = async (id, formData, token) => {
  try {
    return await api.put(`/api/v1/ads/${id}`, formData, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to update ad." };
  }
};

// --------------------------------------
// Delete Ad
// --------------------------------------
export const deleteAd = async (id, token) => {
  try {
    return await api.delete(`/api/v1/ads/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to delete ad." };
  }
};

// --------------------------------------
// Ad Position Options
// --------------------------------------
export const AD_POSITIONS = [
  { value: "horizontal_1", label: "Horizontal 1" },
  { value: "horizontal_2", label: "Horizontal 2" },
  { value: "horizontal_3", label: "Horizontal 3" },
  { value: "vertical_1", label: "Vertical 1" },
  { value: "vertical_2", label: "Vertical 2" },
  { value: "vertical_3", label: "Vertical 3" },
  { value: "vertical_4", label: "Vertical 4" },
];

// --------------------------------------
// Ad Status Options
// --------------------------------------
export const AD_STATUSES = [
  { value: "DRAFT", label: "Draft" },
  { value: "ACTIVE", label: "Active" },
  { value: "PAUSED", label: "Paused" },
  { value: "EXPIRED", label: "Expired" },
];

// --------------------------------------
// Priority Options
// --------------------------------------
export const AD_PRIORITIES = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];
