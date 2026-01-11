import api from "./index";
import { handleApiError } from "./utils/errorHandler";

// ===============================
// GET ALL OLD QUESTION COLLECTIONS (Base Path - Paginated)
// Endpoint: /api/v1/old-question-collections?page=0&size=10&sortBy=year&sortDir=desc
// ===============================
export const getAllOldQuestions = async (params = {}) => {
  try {
    return await api.get("/api/v1/old-question-collections", { params });
  } catch (err) {
    handleApiError(err);
  }
};

// ===============================
// CREATE OLD QUESTION COLLECTION
// ===============================
export const addOldQuestion = async (formData) => {
  try {
    return await api.post("/api/v1/old-question-collections/admin/old-questions", formData, {
      headers: {
        // Don't manually set Content-Type for FormData
      },
    });
  } catch (err) {
    handleApiError(err);
  }
};

// ===============================
// GET OLD QUESTIONS WITH FILTERS
// ===============================
export const getOldQuestions = async (params = {}) => {
  try {
    return await api.get("/api/v1/old-question-collections/questions", { params });
  } catch (err) {
    handleApiError(err);
  }
};

// ===============================
// FILTER OLD QUESTIONS (courseId, semester, year)
// ===============================
export const filterOldQuestions = async (params = {}) => {
  try {
    return await api.get("/api/v1/old-question-collections/filter", { params });
  } catch (err) {
    handleApiError(err);
  }
};

// ===============================
// GET SEMESTERS BY COURSE
// ===============================
export const getSemestersByCourse = async (courseId) => {
  try {
    return await api.get(`/api/v1/old-question-collections/course/${courseId}/semesters`);
  } catch (err) {
    handleApiError(err);
  }
};

// ===============================
// GET SUBJECTS BY COURSE AND SEMESTER
// ===============================
export const getSubjectsBySemester = async (courseId, semester) => {
  try {
    return await api.get(`/api/v1/old-question-collections/course/${courseId}/semester/${semester}/subjects`);
  } catch (err) {
    handleApiError(err);
  }
};

// ===============================
// GET OLD QUESTIONS BY SYLLABUS
// ===============================
export const getOldQuestionsBySyllabus = async (syllabusId) => {
  try {
    return await api.get(`/api/v1/old-question-collections/syllabus/${syllabusId}`);
  } catch (err) {
    handleApiError(err);
  }
};

// ===============================
// VIEW OLD QUESTION PDF (URL for external viewing)
// ===============================
export const getOldQuestionPdfUrl = (id) => {
  return `https://api.entrancegateway.com/api/v1/old-question-collections/view/${id}`;
};

// ===============================
// FETCH OLD QUESTION PDF BLOB (for PdfViewer component)
// Endpoint: GET /api/v1/old-question-collections/{id}/file
// Returns: Binary PDF data as Blob
// ===============================
export const fetchOldQuestionPdfBlob = async (url, token) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }

    return await response.blob();
  } catch (err) {
    console.error("PDF fetch error:", err);
    throw err;
  }
};

// Helper to get the file endpoint URL for a specific old question
export const getOldQuestionFileUrl = (id) => {
  return `https://api.entrancegateway.com/api/v1/old-question-collections/${id}/file`;
};

// ===============================
// DELETE OLD QUESTION
// ===============================
export const deleteOldQuestion = async (id) => {
  try {
    return await api.delete(`/api/v1/old-question-collections/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};

// ===============================
// UPDATE OLD QUESTION
// ===============================
export const updateOldQuestion = async (id, formData) => {
  try {
    return await api.put(`/api/v1/old-question-collections/admin/old-questions/${id}`, formData, {
      headers: {
        // Don't manually set Content-Type for FormData
      },
    });
  } catch (err) {
    handleApiError(err);
  }
};
