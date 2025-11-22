import api from "./index";

// Create a course (with optional token)
export const createCourse = async (Data, token) => {
  return await api.post("/api/v1/courses", Data, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// Get all courses (with optional params and token)
export const getCourse = async (params = {}, token) => {
  return await api.get("/api/v1/courses", {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// Update course by id
export const updateCourse = async (id, Data, token) => {
  return await api.put(`/api/v1/courses/${id}`, Data, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// Delete course by id
export const deleteCourse = async (id, token) => {
  return await api.delete(`/api/v1/courses/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};
