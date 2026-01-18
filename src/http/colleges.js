import api from "./index";
import { handleApiError } from "./utils/errorHandler";

// Create college with multipart form data (logo + images)
export const createColleges = async (formData, logo, images) => {
  try {
    const data = new FormData();

    // Append college data as JSON blob (required by @RequestPart("college"))
    const collegeBlob = new Blob([JSON.stringify(formData)], {
      type: 'application/json'
    });
    data.append("college", collegeBlob);

    // Append logo file - REQUIRED by backend
    if (logo && logo instanceof File) {
      data.append("logo", logo);
    } else {
      throw new Error("Logo file is required");
    }

    // Append images files
    if (images && images.length > 0) {
      images.forEach((image) => {
        if (image instanceof File) {
          data.append("images", image);
        }
      });
    }

    return await api.post("/api/v1/colleges", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err) {
    console.error("Create college error:", err);
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

// Update college with multipart form data
export const updateColleges = async (id, formData, logo, images, existingLogoUrl = null, existingImageUrls = []) => {
  try {
    const data = new FormData();

    // Fields that should NOT be sent (backend-generated or relationships)
    const excludeFields = ['collegeId', 'logoName', 'collegePictureName', 'courses'];

    // Create clean college object without excluded fields
    const collegeData = {};
    Object.keys(formData).forEach((key) => {
      if (!excludeFields.includes(key)) {
        collegeData[key] = formData[key];
      }
    });

    // Append college data as JSON blob (required by @RequestPart("college"))
    const collegeBlob = new Blob([JSON.stringify(collegeData)], {
      type: 'application/json'
    });
    data.append("college", collegeBlob);

    // Handle logo - REQUIRED by backend
    if (logo && logo instanceof File) {
      data.append("logo", logo);
    } else if (existingLogoUrl) {
      // Download existing logo and re-upload it
      try {
        const response = await fetch(existingLogoUrl);
        const blob = await response.blob();
        const filename = existingLogoUrl.split('/').pop() || 'existing_logo.jpg';
        const file = new File([blob], filename, { type: blob.type });
        data.append("logo", file);
      } catch (err) {
        console.error("Failed to download existing logo:", err);
        // Send empty blob as fallback
        const emptyBlob = new Blob([], { type: 'application/octet-stream' });
        data.append("logo", emptyBlob, "no-change.tmp");
      }
    } else {
      const emptyBlob = new Blob([], { type: 'application/octet-stream' });
      data.append("logo", emptyBlob, "no-change.tmp");
    }

    // Handle images - Backend will ADD new images to existing ones
    if (images && images.length > 0) {
      images.forEach((image) => {
        if (image instanceof File) {
          data.append("images", image);
        }
      });
    } else {
      // No new images - send empty blob (backend should skip processing)
      const emptyBlob = new Blob([], { type: 'application/octet-stream' });
      data.append("images", emptyBlob, "no-change.tmp");
    }

    return await api.put(`/api/v1/colleges/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err) {
    console.error("Update college error:", err);
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

// Remove course from college
export const removeCourseFromCollege = async (collegeId, courseId) => {
  try {
    return await api.delete(
      `/api/v1/colleges/${collegeId}/courses/${courseId}`
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

// Get college logo URL
export const getCollegeLogoUrl = (collegeId) => {
  const baseURL = api.defaults.baseURL || '';
  return `${baseURL}/api/v1/colleges/${collegeId}/logo`;
};

// Get college image URL
export const getCollegeImageUrl = (collegeId, imageName) => {
  const baseURL = api.defaults.baseURL || '';
  return `${baseURL}/api/v1/colleges/${collegeId}/images/${imageName}`;
};

// Get all college image URLs
export const getCollegeImageUrls = (collegeId, imageNames = []) => {
  // Returns array of URLs for all college images
  return imageNames.map(imageName => getCollegeImageUrl(collegeId, imageName));
};

// Download college logo (if needed for download functionality)
export const downloadCollegeLogo = async (collegeId) => {
  try {
    return await api.get(`/api/v1/colleges/${collegeId}/logo`, {
      responseType: 'blob', // Important for binary data
    });
  } catch (err) {
    handleApiError(err);
  }
};

// Download college image (if needed for download functionality)
export const downloadCollegeImage = async (collegeId, imageName) => {
  try {
    return await api.get(`/api/v1/colleges/${collegeId}/images/${imageName}`, {
      responseType: 'blob', // Important for binary data
    });
  } catch (err) {
    handleApiError(err);
  }
};
