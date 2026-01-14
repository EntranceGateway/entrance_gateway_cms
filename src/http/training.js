import api from "./index";
import { handleApiError } from "./utils/errorHandler";

// Get All Trainings (with pagination & sorting)
export const getTrainings = async (params = {}) => {
  try {
    return await api.get("/api/v1/trainings", { params });
  } catch (err) {
    handleApiError(err);
  }
};

// Get Single Training by ID
export const getTrainingById = async (id) => {
  try {
    return await api.get(`/api/v1/trainings/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};

// Create Training
export const createTraining = async (data) => {
  try {
    return await api.post("/api/v1/trainings", data);
  } catch (err) {
    handleApiError(err);
  }
};

// Update Training
export const updateTraining = async (id, data) => {
  try {
    return await api.put(`/api/v1/trainings/${id}`, data);
  } catch (err) {
    handleApiError(err);
  }
};

// Delete Training
export const deleteTraining = async (id) => {
  try {
    return await api.delete(`/api/v1/trainings/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};
