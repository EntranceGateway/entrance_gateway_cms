import api from "./index";

// --------------------------------------
// Get All Blogs (with pagination & sorting)
// --------------------------------------
export const getBlogs = async (params = {}, token) => {
  try {
    return await api.get("/api/v1/blogs", {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch blogs." };
  }
};

// --------------------------------------
// Get Single Blog by ID
// --------------------------------------
export const getBlogById = async (id, token) => {
  try {
    return await api.get(`/api/v1/blogs/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to fetch blog." };
  }
};

// --------------------------------------
// Create Blog
// --------------------------------------
export const createBlog = async (formData, token) => {
  try {
    return await api.post("/api/v1/blogs", formData, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to create blog." };
  }
};

// --------------------------------------
// Update Blog
// --------------------------------------
export const updateBlog = async (id, formData, token) => {
  try {
    return await api.put(`/api/v1/blogs/${id}`, formData, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to update blog." };
  }
};

// --------------------------------------
// Delete Blog
// --------------------------------------
export const deleteBlog = async (id, token) => {
  try {
    return await api.delete(`/api/v1/blogs/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || { error: "Failed to delete blog." };
  }
};

// --------------------------------------
// Download Blog File/Image
// --------------------------------------
export const downloadBlogFile = async (id, token) => {
  try {
    const response = await api.get(`/api/v1/blogs/${id}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      responseType: "blob",
    });
    return response;
  } catch (err) {
    throw err.response?.data || { error: "Failed to download blog file." };
  }
};

// --------------------------------------
// Get Blog File URL (for inline viewing)
// --------------------------------------
export const getBlogFileUrl = (id) => {
  return `https://api.entrancegateway.com/api/v1/blogs/${id}/download`;
};
