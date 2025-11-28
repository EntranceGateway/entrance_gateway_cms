import api from "./index"; // your axios instance

// ----------------------------
// Get syllabus by ID
// ----------------------------
export const getSyllabusById = async (id, token) => {
  try {
    return await api.get(`/api/v1/syllabus/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to load syllabus" };
  }
};

// ----------------------------
// Update syllabus
// ----------------------------
export const updateSyllabus = async (id, formData, token) => {
  try {
    return await api.put(`/api/v1/syllabus/${id}`, formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "multipart/form-data", // force multipart
      },
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to update syllabus" };
  }
};


// ----------------------------
// Get all syllabus
// ----------------------------
export const getSyllabusAll = async (params = {}, token) => {
  try {
    return await api.get("/api/v1/syllabus", {
      params, // auto appended on URL if not empty
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch syllabus list" };
  }
};


// ----------------------------
// Delete syllabus
// ----------------------------
export const deleteSyllabus = async (id, token) => {
  try {
    return await api.delete(`/api/v1/syllabus/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to delete syllabus" };
  }
};
