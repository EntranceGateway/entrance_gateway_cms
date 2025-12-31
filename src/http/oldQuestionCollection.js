import api from "./index";

// ===============================
// CREATE OLD QUESTION COLLECTION
// ===============================
export const addOldQuestion = async (formData, token) => {
  try {
    return await api.post("/api/v1/old-question-collections/admin/old-questions", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't manually set Content-Type for FormData
      },
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// GET OLD QUESTIONS WITH FILTERS
// ===============================
export const getOldQuestions = async (params = {}, token) => {
  try {
    return await api.get("/api/v1/old-question-collections/questions", {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// FILTER OLD QUESTIONS (courseId, semester, year)
// ===============================
export const filterOldQuestions = async (params = {}, token) => {
  try {
    return await api.get("/api/v1/old-question-collections/filter", {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// GET SEMESTERS BY COURSE
// ===============================
export const getSemestersByCourse = async (courseId, token) => {
  try {
    return await api.get(`/api/v1/old-question-collections/course/${courseId}/semesters`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// GET SUBJECTS BY COURSE AND SEMESTER
// ===============================
export const getSubjectsBySemester = async (courseId, semester, token) => {
  try {
    return await api.get(`/api/v1/old-question-collections/course/${courseId}/semester/${semester}/subjects`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// GET OLD QUESTIONS BY SYLLABUS
// ===============================
export const getOldQuestionsBySyllabus = async (syllabusId, token) => {
  try {
    return await api.get(`/api/v1/old-question-collections/syllabus/${syllabusId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// VIEW OLD QUESTION PDF
// ===============================
export const getOldQuestionPdfUrl = (id) => {
  return `https://api.entrancegateway.com/api/v1/old-question-collections/view/${id}`;
};

// ===============================
// DELETE OLD QUESTION
// ===============================
export const deleteOldQuestion = async (id, token) => {
  try {
    return await api.delete(`/api/v1/old-question-collections/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// UPDATE OLD QUESTION
// ===============================
export const updateOldQuestion = async (id, formData, token) => {
  try {
    return await api.put(`/api/v1/old-question-collections/admin/old-questions/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't manually set Content-Type for FormData
      },
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};
