import api from "./index";

// --------------------------------------
// Create Course
// --------------------------------------
export const createCourse = async (data, token) => {
  try {
    return await api.post("/api/v1/courses", data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Something went wrong." };
  }
};

// --------------------------------------
// Get All Courses (with filters)
// --------------------------------------
export const getCourses = async (params = {}, token) => {
  try {
    return await api.get("/api/v1/courses", {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch courses." };
  }
};

// --------------------------------------
// Get Courses By Affiliation
// --------------------------------------
export const getCoursesByAffiliation = async (params = {}, token) => {
  try {
    return await api.get("/api/v1/courses/by-affiliation", {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch courses by affiliation." };
  }
};

// --------------------------------------
// Get Single Course
// --------------------------------------
export const getSingleCourse = async (id, token) => {
  try {
    return await api.get(`/api/v1/courses/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to load course." };
  }
};

// --------------------------------------
// Update Course
// --------------------------------------
export const updateCourse = async (id, data, token) => {
  try {
    return await api.put(`/api/v1/courses/${id}`, data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to update course." };
  }
};

// --------------------------------------
// Delete Course
// --------------------------------------
export const deleteCourse = async (id, token) => {
  try {
    return await api.delete(`/api/v1/courses/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to delete course." };
  }
};
