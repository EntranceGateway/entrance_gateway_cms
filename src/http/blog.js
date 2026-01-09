import api from "./index";
import { handleApiError } from "./utils/errorHandler";

// --------------------------------------
// Get All Blogs (with pagination & sorting)
// --------------------------------------
export const getBlogs = async (params = {}) => {
  try {
    return await api.get("/api/v1/blogs", { params });
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Get Single Blog by ID
// --------------------------------------
export const getBlogById = async (id) => {
  try {
    return await api.get(`/api/v1/blogs/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Create Blog
// --------------------------------------
export const createBlog = async (formData) => {
  try {
    return await api.post("/api/v1/blogs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Update Blog
// --------------------------------------
export const updateBlog = async (id, formData) => {
  try {
    return await api.put(`/api/v1/blogs/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Delete Blog
// --------------------------------------
export const deleteBlog = async (id) => {
  try {
    return await api.delete(`/api/v1/blogs/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Download Blog File/Image
// --------------------------------------
export const downloadBlogFile = async (id) => {
  try {
    const response = await api.get(`/api/v1/blogs/${id}/file`, {
      responseType: "blob",
    });
    return response;
  } catch (err) {
    handleApiError(err);
  }
};

// --------------------------------------
// Get Blog File URL (for inline viewing)
// --------------------------------------
export const getBlogFileUrl = (blogId) => {
  return `https://api.entrancegateway.com/api/v1/blogs/${blogId}/file`;
};
