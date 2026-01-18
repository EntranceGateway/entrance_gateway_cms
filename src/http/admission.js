import api from "./index";
import { handleApiError } from "./utils/errorHandler";

// --------------------------------------
// Apply for Admission
// --------------------------------------
export const applyForAdmission = async (admissionData) => {
  try {
    return await api.post("/api/v1/admissions", admissionData);
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Get All Admissions (Admin)
// --------------------------------------
export const getAdmissions = async (params = {}) => {
  try {
    return await api.get("/api/v1/admissions", { params });
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Get Admission by ID
// --------------------------------------
export const getAdmissionById = async (id) => {
  try {
    return await api.get(`/api/v1/admissions/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Get My Admission Applications
// --------------------------------------
export const getMyAdmissions = async () => {
  try {
    return await api.get("/api/v1/admissions/my-applications");
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Get Admissions by Status (Admin)
// --------------------------------------
export const getAdmissionsByStatus = async (status, params = {}) => {
  try {
    return await api.get(`/api/v1/admissions/status/${status}`, { params });
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Update Admission Status (Admin)
// --------------------------------------
export const updateAdmissionStatus = async (id, status, remarks = "") => {
  try {
    return await api.put(`/api/v1/admissions/${id}/status`, null, {
      params: { status, remarks },
    });
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Withdraw Admission Application
// --------------------------------------
export const withdrawAdmission = async (id) => {
  try {
    return await api.delete(`/api/v1/admissions/${id}/withdraw`);
  } catch (err) {
    handleApiError(err);
  }
};
