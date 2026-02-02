import api from "./index";
import { handleApiError } from "./utils/errorHandler";

// Create college with multipart form data (logo + images)
export const createColleges = async (formData, logo, images) => {
  try {
    const data = new FormData();

    // Log the formData being sent
    console.log("=== CREATE COLLEGE - FormData being sent ===");
    console.log("College Data:", formData);
    console.log("College Data JSON:", JSON.stringify(formData));
    console.log("Latitude:", formData.latitude);
    console.log("Longitude:", formData.longitude);
    console.log("College Name:", formData.collegeName);
    console.log("Website:", formData.website);
    console.log("Affiliation:", formData.affiliation);

    // Append college data as JSON blob (required by @RequestPart("college"))
    const collegeJson = JSON.stringify(formData);
    console.log("College JSON string:", collegeJson);
    
    const collegeBlob = new Blob([collegeJson], {
      type: 'application/json'
    });
    console.log("College Blob size:", collegeBlob.size);
    data.append("college", collegeBlob); // No filename, just like your example

    // Append logo file - REQUIRED by backend
    if (logo && logo instanceof File) {
      data.append("logo", logo);
      console.log("Logo:", logo.name);
    } else {
      throw new Error("Logo file is required");
    }

    // Append images files - REQUIRED by backend
    if (images && images.length > 0) {
      images.forEach((image) => {
        if (image instanceof File) {
          data.append("images", image);
        }
      });
      console.log(`Images: ${images.length} file(s)`);
    } else {
      // Backend requires 'images' part - send empty file if no images
      const emptyBlob = new Blob([], { type: 'application/octet-stream' });
      const emptyFile = new File([emptyBlob], '', { type: 'application/octet-stream' });
      data.append("images", emptyFile);
      console.log("No images - sending empty file");
    }

    console.log("=== END ===");

    // Let axios automatically set Content-Type with boundary
    const response = await api.post("/api/v1/colleges", data);

    return response;
  } catch (err) {
    console.error("Create college error:", err);
    console.error("Error response data:", err.response?.data);
    console.error("Error response status:", err.response?.status);
    console.error("Error response headers:", err.response?.headers);
    
    // Enhanced error handling
    if (err.response) {
      const errorData = err.response.data;
      
      // Handle field validation errors
      if (errorData.fieldErrors) {
        console.error("Field errors:", errorData.fieldErrors);
        const fieldErrorMessages = Object.entries(errorData.fieldErrors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(', ');
        const error = new Error(`Validation errors: ${fieldErrorMessages}`);
        error.response = err.response; // Preserve response for form to parse
        throw error;
      }
      
      const errorMessage = errorData?.message || errorData?.messageDetail || "Failed to create college";
      
      // Create user-friendly error message
      if (errorMessage.includes("image")) {
        throw new Error("Error processing images. Please check your image files and try again.");
      } else if (errorMessage.includes("logo")) {
        throw new Error("Error processing logo. Please check your logo file and try again.");
      } else if (errorMessage.includes("validation")) {
        const error = new Error("Validation error: " + errorMessage);
        error.response = err.response;
        throw error;
      } else if (errorMessage.includes("duplicate") || errorMessage.includes("already exists")) {
        throw new Error("A college with this name already exists.");
      } else {
        const error = new Error(errorMessage);
        error.response = err.response;
        throw error;
      }
    } else if (err.message) {
      throw new Error(err.message);
    } else {
      throw new Error("Network error. Please check your connection and try again.");
    }
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

    // Log the data being sent
    console.log("=== UPDATE COLLEGE - FormData being sent ===");
    console.log("College ID:", id);
    console.log("College Data:", collegeData);
    console.log("Latitude:", collegeData.latitude);
    console.log("Longitude:", collegeData.longitude);

    // Append college data as JSON blob (required by @RequestPart("college"))
    const collegeBlob = new Blob([JSON.stringify(collegeData)], {
      type: 'application/json'
    });
    data.append("college", collegeBlob); // No filename

    // Handle logo - REQUIRED by backend
    if (logo && logo instanceof File) {
      // New logo uploaded
      data.append("logo", logo);
      console.log("Uploading new logo:", logo.name);
    } else if (existingLogoUrl && formData.logoName) {
      // No new logo - re-upload existing with original backend filename
      try {
        const response = await fetch(existingLogoUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch logo: ${response.status}`);
        }
        const blob = await response.blob();
        // Use the logoName from backend data to preserve original filename
        const file = new File([blob], formData.logoName, { type: blob.type });
        data.append("logo", file);
        console.log("Re-uploading existing logo with name:", formData.logoName);
      } catch (err) {
        console.error("Failed to download existing logo:", err);
        throw new Error("Failed to process existing logo. Please try uploading a new logo.");
      }
    } else {
      throw new Error("Logo is required");
    }

    // Handle images - Backend REQUIRES this part even if empty
    if (images && images.length > 0) {
      // Add new images
      images.forEach((image) => {
        if (image instanceof File) {
          data.append("images", image);
        }
      });
      console.log(`Adding ${images.length} new image(s)`);
    } else {
      // Backend requires 'images' part - send empty file
      const emptyBlob = new Blob([], { type: 'application/octet-stream' });
      const emptyFile = new File([emptyBlob], '', { type: 'application/octet-stream' });
      data.append("images", emptyFile);
      console.log("No new images - sending empty file");
    }

    console.log("=== END ===");

    // Let axios automatically set Content-Type with boundary
    const response = await api.put(`/api/v1/colleges/${id}`, data);

    return response;
  } catch (err) {
    console.error("Update college error:", err);
    
    // Enhanced error handling
    if (err.response) {
      const errorData = err.response.data;
      const errorMessage = errorData?.message || errorData?.messageDetail || "Failed to update college";
      
      // Create user-friendly error message
      if (errorMessage.includes("image")) {
        throw new Error("Error processing images. Please try again.");
      } else if (errorMessage.includes("logo")) {
        throw new Error("Error processing logo. Please upload a new logo.");
      } else if (errorMessage.includes("validation")) {
        throw new Error("Validation error: " + errorMessage);
      } else {
        throw new Error(errorMessage);
      }
    } else if (err.message) {
      throw new Error(err.message);
    } else {
      throw new Error("Network error. Please check your connection and try again.");
    }
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
