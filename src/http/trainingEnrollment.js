import api from "./index";
import { handleApiError } from "./utils/errorHandler";

// --------------------------------------
// Enroll in Training Program
// --------------------------------------
export const enrollInTraining = async (trainingId, idempotencyKey) => {
  try {
    return await api.post(`/api/v1/training-enrollments/${trainingId}/enroll`, null, {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    });
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Get All Training Enrollments (Admin)
// --------------------------------------
export const getTrainingEnrollments = async (params = {}) => {
  try {
    return await api.get("/api/v1/training-enrollments", { params });
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Get Enrollment by ID
// --------------------------------------
export const getTrainingEnrollmentById = async (id) => {
  try {
    return await api.get(`/api/v1/training-enrollments/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Get My Training Enrollments
// --------------------------------------
export const getMyTrainingEnrollments = async () => {
  try {
    return await api.get("/api/v1/training-enrollments/my-enrollments");
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Get Enrollments by Status (Admin)
// --------------------------------------
export const getTrainingEnrollmentsByStatus = async (status, params = {}) => {
  try {
    return await api.get(`/api/v1/training-enrollments/status/${status}`, { params });
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Cancel Enrollment
// --------------------------------------
export const cancelTrainingEnrollment = async (id) => {
  try {
    return await api.delete(`/api/v1/training-enrollments/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Update Enrollment Progress (Admin)
// --------------------------------------
export const updateEnrollmentProgress = async (id, progressPercentage) => {
  try {
    return await api.patch(`/api/v1/training-enrollments/${id}/progress`, null, {
      params: { progressPercentage },
    });
  } catch (err) {
    handleApiError(err);
  }
};
