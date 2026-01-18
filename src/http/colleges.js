import api from "./index";
import { handleApiError } from "./utils/errorHandler";

// Create college with multipart form data (logo + images)
export const createColleges = async (formData, logo, images) => {
  try {
    const data = new FormData();

    // Debug: Log what we're sending
    console.log("=== CREATE COLLEGE API CALL ===");
    console.log("FormData object:", formData);
    console.log("Logo file:", logo);
    console.log("Logo type:", logo ? logo.constructor.name : "null");
    console.log("Images:", images);

    // Append all form fields individually (NOT as JSON string)
    // Send null for empty values instead of empty strings
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      // Send null for undefined, null, or empty strings
      if (value === undefined || value === null || value === "") {
        console.log(`✓ Appending ${key}: null (empty value)`);
        data.append(key, "null");
      } else {
        console.log(`✓ Appending ${key}:`, value);
        data.append(key, value);
      }
    });

    // Append logo file - REQUIRED by backend
    if (logo && logo instanceof File) {
      console.log("✓ Appending logo file:", logo.name, logo.size, "bytes");
      data.append("logo", logo);
    } else {
      console.error("✗ Logo is missing or not a File object:", logo);
      throw new Error("Logo file is required");
    }

    // Append images files
    if (images && images.length > 0) {
      console.log(`✓ Appending ${images.length} image files`);
      images.forEach((image, index) => {
        if (image instanceof File) {
          console.log(`  - Image ${index + 1}:`, image.name, image.size, "bytes");
          data.append("images", image);
        }
      });
    } else {
      console.warn("⚠ No images provided");
    }

    // Debug: Log FormData entries
    console.log("=== FormData entries to be sent ===");
    for (let pair of data.entries()) {
      if (pair[1] instanceof File) {
        console.log(`${pair[0]}: [File] ${pair[1].name}`);
      } else {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    }
    console.log("=== END ===");

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
export const updateColleges = async (id, formData, logo, images) => {
  try {
    const data = new FormData();

    // Debug: Log what we're sending
    console.log("=== UPDATE COLLEGE API CALL ===");
    console.log("College ID:", id);
    console.log("FormData object:", formData);
    console.log("Logo file:", logo);
    console.log("Images:", images);

    // Fields that should NOT be sent (backend-generated or relationships)
    const excludeFields = ['collegeId', 'logoName', 'collegePictureName', 'courses'];

    // Append all form fields individually (NOT as JSON string)
    // Send null for empty values instead of empty strings
    Object.keys(formData).forEach((key) => {
      // Skip excluded fields
      if (excludeFields.includes(key)) {
        console.log(`⊘ Excluding ${key}: (backend-generated or relationship field)`);
        return;
      }

      const value = formData[key];
      // Send null for undefined, null, or empty strings
      if (value === undefined || value === null || value === "") {
        console.log(`✓ Appending ${key}: null (empty value)`);
        data.append(key, "null");
      } else {
        console.log(`✓ Appending ${key}:`, value);
        data.append(key, value);
      }
    });

    // Append logo file - REQUIRED by backend even for updates
    // If no new logo provided, send empty blob to satisfy backend requirement
    if (logo && logo instanceof File) {
      console.log("✓ Appending logo file:", logo.name, logo.size, "bytes");
      data.append("logo", logo);
    } else {
      console.log("⚠ No new logo file provided - sending empty blob to satisfy backend");
      // Create an empty blob with a dummy filename
      const emptyBlob = new Blob([], { type: 'application/octet-stream' });
      data.append("logo", emptyBlob, "no-change.tmp");
    }

    // Append images files if provided (OPTIONAL for update)
    if (images && images.length > 0) {
      console.log(`✓ Appending ${images.length} image files`);
      images.forEach((image, index) => {
        if (image instanceof File) {
          console.log(`  - Image ${index + 1}:`, image.name, image.size, "bytes");
          data.append("images", image);
        }
      });
    } else {
      console.log("ℹ No new images provided (keeping existing)");
    }

    // Debug: Log FormData entries
    console.log("=== FormData entries to be sent ===");
    for (let pair of data.entries()) {
      if (pair[1] instanceof File || pair[1] instanceof Blob) {
        console.log(`${pair[0]}: [File/Blob] ${pair[1].name || 'blob'} (${pair[1].size} bytes)`);
      } else {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
    }
    console.log("=== END ===");

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
  // Returns the URL for the logo endpoint
  // Frontend can use this directly in <img src={} />
  return `${api.defaults.baseURL}/api/v1/colleges/${collegeId}/logo`;
};

// Get college image URL
export const getCollegeImageUrl = (collegeId, imageName) => {
  // Returns the URL for a specific college image
  // Frontend can use this directly in <img src={} />
  return `${api.defaults.baseURL}/api/v1/colleges/${collegeId}/images/${imageName}`;
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
