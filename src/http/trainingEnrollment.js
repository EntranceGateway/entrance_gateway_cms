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
// Cancel Enrollment (User)
// --------------------------------------
export const cancelTrainingEnrollment = async (id) => {
  try {
    return await api.delete(`/api/v1/training-enrollments/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Cancel Enrollment by System (Admin)
// --------------------------------------
export const cancelEnrollmentBySystem = async (id) => {
  try {
    return await api.delete(`/api/v1/training-enrollments/cancle-by-system/${id}`);
  } catch (err) {
    if (err.response) {
      const errorData = err.response.data;
      const errorMessage = errorData?.message || errorData?.messageDetail || "Failed to cancel enrollment";
      const status = err.response.status;
      
      // Handle specific error cases
      if (status === 404) {
        throw new Error("Enrollment not found. It may have been already deleted.");
      } else if (status === 403) {
        throw new Error("You do not have permission to cancel enrollments. Admin access required.");
      } else if (errorMessage.includes("Not Found")) {
        throw new Error("Training enrollment not found with the provided ID");
      } else if (errorMessage.includes("permission") || errorMessage.includes("Forbidden")) {
        throw new Error("Access denied. Only admins can cancel enrollments by system.");
      } else if (errorMessage.includes("already cancelled")) {
        throw new Error("This enrollment has already been cancelled");
      } else if (errorMessage.includes("completed")) {
        throw new Error("Cannot cancel a completed enrollment");
      } else {
        throw new Error(errorMessage);
      }
    } else if (err.request) {
      // Network error - request was made but no response received
      throw new Error("Network error. Please check your connection and try again.");
    } else {
      // Something else happened
      throw new Error(err.message || "Failed to cancel enrollment. Please try again.");
    }
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

// --------------------------------------
// Approve Enrollment (Admin)
// --------------------------------------
export const approveTrainingEnrollment = async (enrollmentId) => {
  try {
    return await api.patch(`/api/v1/training-enrollments/${enrollmentId}/approve`);
  } catch (err) {
    if (err.response) {
      const errorData = err.response.data;
      const errorMessage = errorData?.message || errorData?.messageDetail || "Failed to approve enrollment";
      const status = err.response.status;
      
      // Handle specific error cases
      if (status === 404) {
        throw new Error("Enrollment not found. It may have been deleted.");
      } else if (status === 403) {
        throw new Error("You do not have permission to approve enrollments. Admin access required.");
      } else if (errorMessage.includes("not found")) {
        throw new Error("Enrollment not found");
      } else if (errorMessage.includes("not in pending approval") || errorMessage.includes("not pending")) {
        throw new Error("Only enrollments with pending approval status can be approved");
      } else if (errorMessage.includes("purchase record not found")) {
        throw new Error("Associated purchase record not found. Please verify payment details.");
      } else if (errorMessage.includes("already approved")) {
        throw new Error("This enrollment has already been approved");
      } else if (errorMessage.includes("permission") || errorMessage.includes("Forbidden")) {
        throw new Error("Access denied. Only admins can approve enrollments.");
      } else {
        throw new Error(errorMessage);
      }
    } else if (err.request) {
      throw new Error("Network error. Please check your connection and try again.");
    } else {
      throw new Error(err.message || "Failed to approve enrollment. Please try again.");
    }
  }
};

// --------------------------------------
// Reject Enrollment (Admin)
// --------------------------------------
export const rejectTrainingEnrollment = async (enrollmentId, reason) => {
  try {
    if (!reason || !reason.trim()) {
      throw new Error("Rejection reason is required");
    }
    
    return await api.patch(`/api/v1/training-enrollments/${enrollmentId}/reject`, null, {
      params: { reason: reason.trim() },
    });
  } catch (err) {
    // If it's our validation error, throw it directly
    if (err.message === "Rejection reason is required") {
      throw err;
    }
    
    if (err.response) {
      const errorData = err.response.data;
      const errorMessage = errorData?.message || errorData?.messageDetail || "Failed to reject enrollment";
      const status = err.response.status;
      
      // Handle specific error cases
      if (status === 404) {
        throw new Error("Enrollment not found. It may have been deleted.");
      } else if (status === 403) {
        throw new Error("You do not have permission to reject enrollments. Admin access required.");
      } else if (status === 400 && errorMessage.includes("reason")) {
        throw new Error("Rejection reason is required and cannot be empty");
      } else if (errorMessage.includes("not found")) {
        throw new Error("Enrollment not found");
      } else if (errorMessage.includes("Only pending approval") || errorMessage.includes("not pending")) {
        throw new Error("Only enrollments with pending approval status can be rejected");
      } else if (errorMessage.includes("already rejected")) {
        throw new Error("This enrollment has already been rejected");
      } else if (errorMessage.includes("permission") || errorMessage.includes("Forbidden")) {
        throw new Error("Access denied. Only admins can reject enrollments.");
      } else {
        throw new Error(errorMessage);
      }
    } else if (err.request) {
      throw new Error("Network error. Please check your connection and try again.");
    } else {
      throw new Error(err.message || "Failed to reject enrollment. Please try again.");
    }
  }
};
