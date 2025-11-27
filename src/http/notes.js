import api from "./index";

// Create college
export const createNotes = async (data, token) => {
  try {
    return await api.post("/api/v1/notes", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};


// Get all colleges (optional)
export const getNotes = async (params = {}, token) => {
  try {
    return await api.get("/api/v1/notes", {
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
    return await api.get(`/api/v1/notes/getNotefile/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Update college
export const updateNotes = async (id, Data, token) => {
  try {
    return await api.put(`/api/v1/colleges/${id}`, Data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Delete college
export const deleteNotes= async (id, token) => {
  try {
    return await api.delete(`/api/v1/notes/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};
