import axios from "axios";

export const addSyllabus = async (formData, token) => {
  return await axios.post(
    "http://185.177.116.173:8080/api/v1/syllabus",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};


// Get syllabus by ID (for edit)
export const getSyllabusById = async (id, token) => {
  return await API.get(`/api/v1/syllabus/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Update syllabus
export const updateSyllabus = async (id, formData, token) => {
  return await API.put(`/api/v1/syllabus/${id}`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Get all syllabus
export const getSyllabusAll = async (token) => {
  return await API.get("/api/v1/syllabus", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Delete syllabus
export const deleteSyllabus = async (id, token) => {
  return await API.delete(`/api/v1/syllabus/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
