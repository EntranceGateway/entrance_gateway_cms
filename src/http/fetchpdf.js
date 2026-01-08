import api from "./index"; // axios instance

export const getSingle = async (url, token) => {
  if (!token) throw new Error("Authentication token is missing");

  try {
    const res = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf",
      },
      responseType: "blob",
      withCredentials: true,
    });

    if (res.status !== 200) {
      throw new Error(`Unexpected response status: ${res.status}`);
    }

    const contentType = res.headers["content-type"];
    
    // Check if response is actually a PDF
    if (contentType && contentType.includes("application/json")) {
      // API returned JSON error instead of PDF - parse it
      const text = await res.data.text();
      const errorData = JSON.parse(text);
      throw new Error(errorData.message || errorData.error || "Failed to fetch PDF");
    }

    if (!contentType || !contentType.includes("application/pdf")) {
      throw new Error(`Invalid response type: ${contentType || 'unknown'}`);
    }

    // Validate blob
    if (!res.data || !(res.data instanceof Blob) || res.data.size === 0) {
      throw new Error("Received empty or invalid PDF response");
    }

    return res.data; // blob
  } catch (error) {
    // Handle axios errors
    if (error.response) {
      const { status, data } = error.response;
      
      // Try to extract error message from blob response
      if (data instanceof Blob) {
        try {
          const text = await data.text();
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || errorData.error || `Server error: ${status}`);
        } catch {
          throw new Error(`Server error: ${status}`);
        }
      }
      
      throw new Error(data?.message || data?.error || `Server error: ${status}`);
    }
    throw error;
  }
};

// URL builder functions for file endpoints (matching API docs)
const noteFile = (id) => `/api/v1/notes/${id}/file`;
const syllabusFile = (id) => `/api/v1/syllabus/${id}/file`;
const noticeFile = (id) => `/api/v1/notices/${id}/file`;

export {
    noteFile,
    syllabusFile,
    noticeFile
}