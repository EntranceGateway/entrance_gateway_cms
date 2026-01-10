import api from "./index"; // Axios instance
import { handleApiError } from "./utils/errorHandler";

// ===============================
// CREATE SYLLABUS (JSON + File)
// ===============================
export const addSyllabus = async (formData) => {
  try {
    return await api.post("/api/v1/syllabus", formData, {
      headers: {
        // ❌ Don't manually set Content-Type for FormData
      },
    });
  } catch (err) {
    handleApiError(err);
  }
};

// ===============================
// GET ALL SYLLABUS
// ===============================
export const getSyllabus = async (params = {}) => {
  try {
    return await api.get("/api/v1/syllabus", { params });
  } catch (err) {
    handleApiError(err);
  }
};

// ===============================
// GET SYLLABUS BY AFFILIATION AND COURSE
// ===============================
export const getSyllabusByAffiliationAndCourse = async (params = {}) => {
  try {
    return await api.get("/api/v1/syllabus/by-affiliation/by-course", { params });
  } catch (err) {
    handleApiError(err);
  }
};

// ===============================
// GET SYLLABUS BY AFFILIATION, COURSE, AND SEMESTER
// ===============================
export const getSyllabusByAffiliationCourseAndSemester = async (params = {}) => {
  try {
    return await api.get("/api/v1/syllabus/by-affiliation/by-course/semester", { params });
  } catch (err) {
    handleApiError(err);
  }
};

// ===============================
// GET SYLLABUS BY COURSE ID
// ===============================
export const getSyllabusByCourseId = async (courseId, params = {}) => {
  try {
    return await api.get(`/api/v1/courses/full-syllabus/${courseId}`, {
      params,
    });
  } catch (err) {
    handleApiError(err);
  }
};

// ===============================
// GET SINGLE SYLLABUS
// ===============================
export const getSyllabusById = async (id) => {
  try {
    return await api.get(`/api/v1/syllabus/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};

// ===============================
// GET SYLLABUS FILE
// ===============================

// Get syllabus file (PDF)
export const getSyllabusFile = async (syllabusId) => {
  try {
    return await api.get(`/api/v1/syllabus/${syllabusId}/file`, {
      responseType: "blob", // PDF blob
    });
  } catch (err) {
    handleApiError(err);
  }
};

// ===============================
// UPDATE SYLLABUS DETAILS (JSON or FormData)
// ===============================
export const updateSyllabus = async (id, data) => {
  try {
    // If data is FormData → PUT /file endpoint
    if (data instanceof FormData) {
      return await api.put(`/api/v1/syllabus/${id}/file`, data);
    }

    // Otherwise → JSON PUT
    return await api.put(`/api/v1/syllabus/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    handleApiError(err);
  }
};

// ===============================
// DELETE SYLLABUS
// ===============================
export const deleteSyllabus = async (id) => {
  try {
    return await api.delete(`/api/v1/syllabus/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};
