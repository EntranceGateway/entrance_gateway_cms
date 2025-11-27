import api from "./index";

// Create college
export const createColleges = async (Data, token) => {
  try {
    return await api.post("/api/v1/colleges", Data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Get all colleges (optional)
export const getColleges = async (params = {}, token) => {
  try {
    return await api.get("/api/v1/colleges", {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Get single college by UUID
export const getSingle = async (id, token) => {
  try {
    return await api.get(`/api/v1/colleges/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Update college
export const updateColleges = async (id, Data, token) => {
  try {
    return await api.put(`/api/v1/colleges/${id}`, Data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Delete college
export const deleteColleges = async (id, token) => {
  try {
    return await api.delete(`/api/v1/colleges/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};
