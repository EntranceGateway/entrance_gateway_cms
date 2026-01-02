import axios from 'axios';

const API_BASE_URL = 'https://api.entrancegateway.com/api/v1';

const quizApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
quizApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
quizApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if it's a login request failing
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

const quizApi = {
  // Auth
  login: (email, password) => quizApiClient.post('/auth/login', { email, password }),

  // Categories
  getCategories: (page = 0, size = 10, sortBy = 'categoryName', sortDir = 'asc') =>
    quizApiClient.get(`/categories?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDir}`),
  getCategoryById: (id) => quizApiClient.get(`/categories/${id}`),
  createCategory: (data) => quizApiClient.post('/categories', data),
  updateCategory: (id, data) => quizApiClient.put(`/categories/${id}`, data),
  deleteCategory: (id) => quizApiClient.delete(`/categories/${id}`),

  // Courses
  getCourses: (page = 0, size = 10, sortBy = 'courseName', sortDir = 'asc') =>
    quizApiClient.get(`/courses?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDir}`),
  getCourseById: (id) => quizApiClient.get(`/courses/${id}`),
  getCoursesByCategory: (categoryId, page = 0, size = 10) =>
    quizApiClient.get(`/courses/category/${categoryId}?page=${page}&size=${size}`),

  // Question Sets
  getQuestionSets: (page = 0, size = 10, sortBy = 'setName', sortDir = 'asc') =>
    quizApiClient.get(`/question-sets?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDir}`),
  getQuestionSetById: (id) => quizApiClient.get(`/question-sets/${id}`),
  createQuestionSet: (data) => quizApiClient.post('/question-sets', data),
  updateQuestionSet: (id, data) => quizApiClient.put(`/question-sets/${id}`, data),
  deleteQuestionSet: (id) => quizApiClient.delete(`/question-sets/${id}`),

  // Questions
  getQuestions: (page = 0, size = 10, sortBy = 'question', sortDir = 'asc') =>
    quizApiClient.get(`/questions?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDir}`),
  getQuestionById: (id) => quizApiClient.get(`/questions/${id}`),
  getQuestionsByQuestionSet: (questionSetId, page = 0, size = 10) =>
    quizApiClient.get(`/questions/question-set/${questionSetId}?page=${page}&size=${size}`),
  createQuestion: (data) => {
    // Check if data is FormData (for multipart upload with images)
    if (data instanceof FormData) {
      return quizApiClient.post('/questions', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return quizApiClient.post('/questions', data);
  },
  updateQuestion: (id, data) => {
    // Check if data is FormData (for multipart upload with images)
    if (data instanceof FormData) {
      return quizApiClient.put(`/questions/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return quizApiClient.put(`/questions/${id}`, data);
  },
  deleteQuestion: (id) => quizApiClient.delete(`/questions/${id}`),

  // Quiz Results
  getQuizResults: (page = 0, size = 10, sortBy = 'attemptedAt', sortDir = 'desc') =>
    quizApiClient.get(`/quiz-results?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDir}`),
  getQuizResultById: (resultId) => quizApiClient.get(`/quiz-results/${resultId}`),
  getQuizResultsByUser: (userId, page = 0, size = 10) =>
    quizApiClient.get(`/quiz-results/user/${userId}?page=${page}&size=${size}`),
  getQuizResultsByQuestionSet: (questionSetId, page = 0, size = 10) =>
    quizApiClient.get(`/quiz-results/question-set/${questionSetId}?page=${page}&size=${size}`),
};

export default quizApi;
