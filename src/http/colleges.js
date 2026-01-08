import api from "./index";
import { handleApiError } from "./utils/errorHandler";

// Create college with multipart form data (logo + images)
export const createColleges = async (formData, logo, images) => {
  try {
    const data = new FormData();

    // Append all form fields
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== undefined && formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    // Append logo file
    if (logo) {
      data.append("logo", logo);
    }

    // Append images files
    if (images && images.length > 0) {
      images.forEach((image) => {
        data.append("images", image);
      });
    }

    return await api.post("/api/v1/colleges", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err) {
    handleApiError(err);
  }
};

// Get all colleges (optional)
export const getColleges = async (params = {}) => {
  try {
    return await api.get("/api/v1/colleges", { params });
  } catch (err) {
    handleApiError(err);
  }
};

// Get single college by UUID
export const getSingle = async (id) => {
  try {
    return await api.get(`/api/v1/colleges/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};

// Update college
export const updateColleges = async (id, Data) => {
  try {
    return await api.put(`/api/v1/colleges/${id}`, Data);
  } catch (err) {
    handleApiError(err);
  }
};

// Delete college
export const deleteColleges = async (id) => {
  try {
    return await api.delete(`/api/v1/colleges/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};

// Add course to college
export const addCourseToCollege = async (collegeId, courseId) => {
  try {
    return await api.post(
      `/api/v1/colleges/${collegeId}/courses/${courseId}`,
      null
    );
  } catch (err) {
    handleApiError(err);
  }
};

// Search colleges by keyword
export const searchColleges = async (params = {}) => {
  try {
    return await api.get("/api/v1/colleges/search", { params });
  } catch (err) {
    handleApiError(err);
  }
};

// Get colleges by course ID
export const getCollegesByCourse = async (courseId, params = {}) => {
  try {
    return await api.get(`/api/v1/colleges/by-course/${courseId}`, { params });
  } catch (err) {
    handleApiError(err);
  }
};
