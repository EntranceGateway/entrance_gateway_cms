import api from "./index";

// Create college with multipart form data (logo + images)
export const createColleges = async (formData, logo, images, token) => {
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
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Get all colleges (optional)
export const getColleges = async (params = {}, token) => {
  try {
    return await api.get("/api/v1/colleges", {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Get single college by UUID
export const getSingle = async (id, token) => {
  try {
    return await api.get(`/api/v1/colleges/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Update college
export const updateColleges = async (id, Data, token) => {
  try {
    return await api.put(`/api/v1/colleges/${id}`, Data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Delete college
export const deleteColleges = async (id, token) => {
  try {
    return await api.delete(`/api/v1/colleges/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Add course to college
export const addCourseToCollege = async (collegeId, courseId, token) => {
  try {
    return await api.post(
      `/api/v1/colleges/${collegeId}/courses/${courseId}`,
      null,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Search colleges by keyword
export const searchColleges = async (params = {}, token) => {
  try {
    return await api.get("/api/v1/colleges/search", {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Get colleges by course ID
export const getCollegesByCourse = async (courseId, params = {}, token) => {
  try {
    return await api.get(`/api/v1/colleges/by-course/${courseId}`, {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};
