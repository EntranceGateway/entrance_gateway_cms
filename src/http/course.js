import api from "./index";
import { handleApiError } from "./utils/errorHandler";

// --------------------------------------
// Create Course
// --------------------------------------
export const createCourse = async (data) => {
  try {
    return await api.post("/api/v1/courses", data);
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Get All Courses (with filters)
// --------------------------------------
export const getCourses = async (params = {}) => {
  try {
    return await api.get("/api/v1/courses", { params });
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Get Courses By Affiliation
// --------------------------------------
export const getCoursesByAffiliation = async (params = {}) => {
  try {
    return await api.get("/api/v1/courses/by-affiliation", { params });
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Get Single Course
// --------------------------------------
export const getSingleCourse = async (id) => {
  try {
    return await api.get(`/api/v1/courses/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Update Course
// --------------------------------------
export const updateCourse = async (id, data) => {
  try {
    return await api.put(`/api/v1/courses/${id}`, data);
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Delete Course
// --------------------------------------
export const deleteCourse = async (id) => {
  try {
    return await api.delete(`/api/v1/courses/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};
