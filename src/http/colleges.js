import api from "./index";

export const createColleges = async (Data, token) => {
  return await api.post("/api/v1/colleges", Data, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`
        }
      : {},
  });
};

// Get all courses (with optional params and token)
export const getColleges = async (params = {}, token) => {
  return await api.get("/api/v1/colleges", {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// Update course by id
export const updateColleges = async (id, Data, token) => {
  return await api.put(`/api/v1/colleges/${id}`, Data, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

// Delete course by id
export const deleteColleges = async (id, token) => {
  return await api.delete(`/api/v1/colleges/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};
