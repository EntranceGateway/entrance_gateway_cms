import api from "./index";
import { handleApiError } from "./utils/errorHandler";

// Get all contact messages (paginated)
export const getAllContactMessages = async (params = {}) => {
  try {
    return await api.get("/api/v1/contact-us", { params });
  } catch (err) {
    handleApiError(err);
  }
};

// Get contact message by ID
export const getContactMessageById = async (id) => {
  try {
    return await api.get(`/api/v1/contact-us/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};

// Delete contact message
export const deleteContactMessage = async (id) => {
  try {
    return await api.delete(`/api/v1/contact-us/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};
