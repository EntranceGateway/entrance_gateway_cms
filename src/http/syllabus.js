// src/http/syllabus.js
import api from "./index"; // <-- your main axios instance

// ----------------------------
// Create syllabus
// ----------------------------
export const addSyllabus = async (formData, token) => {
  try {
    return await api.post("/api/v1/syllabus", formData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to create syllabus" };
  }
};

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
      headers: token ? { Authorization: `Bearer ${token}` } : {},
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
