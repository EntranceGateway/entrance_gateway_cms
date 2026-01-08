import api from "../../http/index";
import { handleApiError } from "../../http/utils/errorHandler";

const quizApi = {
  // Categories
  getCategories: async ({ page = 0, size = 10, sortBy = 'categoryName', sortDir = 'asc' } = {}) => {
    try {
      return await api.get(`/api/v1/categories`, {
        params: { page, size, sortBy, sortDirection: sortDir }
      });
    } catch (err) {
      handleApiError(err);
    }
  },

  getCategoryById: async (id) => {
    try {
      return await api.get(`/api/v1/categories/${id}`);
    } catch (err) {
      handleApiError(err);
    }
  },

  createCategory: async (data) => {
    try {
      return await api.post('/api/v1/categories', data);
    } catch (err) {
      handleApiError(err);
    }
  },

  updateCategory: async (id, data) => {
    try {
      return await api.put(`/api/v1/categories/${id}`, data);
    } catch (err) {
      handleApiError(err);
    }
  },

  deleteCategory: async (id) => {
    try {
      return await api.delete(`/api/v1/categories/${id}`);
    } catch (err) {
      handleApiError(err);
    }
  },

  // Courses
  getCourses: async ({ page = 0, size = 10, sortBy = 'courseName', sortDir = 'asc' } = {}) => {
    try {
      return await api.get(`/api/v1/courses`, {
        params: { page, size, sortBy, sortDirection: sortDir }
      });
    } catch (err) {
      handleApiError(err);
    }
  },

  getCourseById: async (id) => {
    try {
      return await api.get(`/api/v1/courses/${id}`);
    } catch (err) {
      handleApiError(err);
    }
  },

  getCoursesByCategory: async (categoryId, { page = 0, size = 10 } = {}) => {
    try {
      return await api.get(`/api/v1/courses/category/${categoryId}`, {
        params: { page, size }
      });
    } catch (err) {
      handleApiError(err);
    }
  },

  // Question Sets
  getQuestionSets: async ({ page = 0, size = 10, sortBy = 'setName', sortDir = 'asc' } = {}) => {
    try {
      return await api.get(`/api/v1/question-sets`, {
        params: { page, size, sortBy, sortDirection: sortDir }
      });
    } catch (err) {
      handleApiError(err);
    }
  },

  getQuestionSetById: async (id) => {
    try {
      return await api.get(`/api/v1/question-sets/${id}`);
    } catch (err) {
      handleApiError(err);
    }
  },

  createQuestionSet: async (data) => {
    try {
      return await api.post('/api/v1/question-sets', data);
    } catch (err) {
      handleApiError(err);
    }
  },

  updateQuestionSet: async (id, data) => {
    try {
      return await api.put(`/api/v1/question-sets/${id}`, data);
    } catch (err) {
      handleApiError(err);
    }
  },

  deleteQuestionSet: async (id) => {
    try {
      return await api.delete(`/api/v1/question-sets/${id}`);
    } catch (err) {
      handleApiError(err);
    }
  },

  // Questions
  getQuestions: async ({ page = 0, size = 10, sortBy = 'question', sortDir = 'asc' } = {}) => {
    try {
      return await api.get(`/api/v1/questions`, {
        params: { page, size, sortBy, sortDirection: sortDir }
      });
    } catch (err) {
      handleApiError(err);
    }
  },

  getQuestionById: async (id) => {
    try {
      return await api.get(`/api/v1/questions/${id}`);
    } catch (err) {
      handleApiError(err);
    }
  },

  getQuestionsByQuestionSet: async (questionSetId, { page = 0, size = 10 } = {}) => {
    try {
      return await api.get(`/api/v1/questions/question-set/${questionSetId}`, {
        params: { page, size }
      });
    } catch (err) {
      handleApiError(err);
    }
  },

  createQuestion: async (data) => {
    try {
      const config = data instanceof FormData ? {
        headers: { 'Content-Type': 'multipart/form-data' }
      } : {};
      return await api.post('/api/v1/questions', data, config);
    } catch (err) {
      handleApiError(err);
    }
  },

  updateQuestion: async (id, data) => {
    try {
      const config = data instanceof FormData ? {
        headers: { 'Content-Type': 'multipart/form-data' }
      } : {};
      return await api.put(`/api/v1/questions/${id}`, data, config);
    } catch (err) {
      handleApiError(err);
    }
  },

  deleteQuestion: async (id) => {
    try {
      return await api.delete(`/api/v1/questions/${id}`);
    } catch (err) {
      handleApiError(err);
    }
  },

  // Quiz Results
  getQuizResults: async ({ page = 0, size = 10, sortBy = 'attemptedAt', sortDir = 'desc' } = {}) => {
    try {
      return await api.get(`/api/v1/quiz-results`, {
        params: { page, size, sortBy, sortDirection: sortDir }
      });
    } catch (err) {
      handleApiError(err);
    }
  },

  getQuizResultById: async (resultId) => {
    try {
      return await api.get(`/api/v1/quiz-results/${resultId}`);
    } catch (err) {
      handleApiError(err);
    }
  },

  getQuizResultsByUser: async (userId, { page = 0, size = 10 } = {}) => {
    try {
      return await api.get(`/api/v1/quiz-results/user/${userId}`, {
        params: { page, size }
      });
    } catch (err) {
      handleApiError(err);
    }
  },

  getQuizResultsByQuestionSet: async (questionSetId, { page = 0, size = 10 } = {}) => {
    try {
      return await api.get(`/api/v1/quiz-results/question-set/${questionSetId}`, {
        params: { page, size }
      });
    } catch (err) {
      handleApiError(err);
    }
  },
};

export default quizApi;
