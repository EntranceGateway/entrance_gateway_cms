import api from "./index"; // Axios instance

// ===============================
// CREATE SYLLABUS (JSON + File)
// ===============================
export const addSyllabus = async (formData, token) => {
  try {
    return await api.post("/api/v1/syllabus", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ Don't manually set Content-Type for FormData
      },
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// GET ALL SYLLABUS
// ===============================
export const getSyllabus = async (params = {}, token) => {
  try {
    return await api.get("/api/v1/syllabus", {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// GET SYLLABUS BY AFFILIATION AND COURSE
// ===============================
export const getSyllabusByAffiliationAndCourse = async (params = {}, token) => {
  try {
    return await api.get("/api/v1/syllabus/by-affiliation/by-course", {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// GET SYLLABUS BY AFFILIATION, COURSE, AND SEMESTER
// ===============================
export const getSyllabusByAffiliationCourseAndSemester = async (params = {}, token) => {
  try {
    return await api.get("/api/v1/syllabus/by-affiliation/by-course/semester", {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// GET SYLLABUS BY COURSE ID
// ===============================
export const getSyllabusByCourseId = async (courseId, params = {}, token) => {
  try {
    return await api.get(`/api/v1/syllabus/by-course`, {
      params: { courseId, ...params },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// GET SINGLE SYLLABUS
// ===============================
export const getSyllabusById = async (id, token) => {
  try {
    return await api.get(`/api/v1/syllabus/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// GET SYLLABUS FILE
// ===============================

// Get syllabus file (PDF)
export const getSyllabusFile = async (syllabusId, token) => {
  try {
    return await api.get(`/api/v1/syllabus/${syllabusId}/file`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      responseType: "blob", // PDF blob
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// UPDATE SYLLABUS DETAILS (JSON or FormData)
// ===============================
export const updateSyllabus = async (id, data, token) => {
  try {
    // If data is FormData → PUT /file endpoint
    if (data instanceof FormData) {
      return await api.put(`/api/v1/syllabus/${id}/file`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // Otherwise → JSON PUT
    return await api.put(`/api/v1/syllabus/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// DELETE SYLLABUS
// ===============================
export const deleteSyllabus = async (id, token) => {
  try {
    return await api.delete(`/api/v1/syllabus/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};
