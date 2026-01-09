import api from "./index"; // axios instance
import { handleApiError } from "./utils/errorHandler";

// ===============================
// CREATE NOTE  (JSON + File)
// ===============================
export const createNote = async (formData) => {
  try {
    return await api.post("/api/v1/notes", formData);
  } catch (err) {
    handleApiError(err);
  }
};

// ===============================
// GET ALL NOTES
// ===============================
export const getNotes = async (params = {}) => {
  try {
    return await api.get("/api/v1/notes", { params });
  } catch (err) {
    handleApiError(err);
  }
};

// ===============================
// GET NOTES BY COURSE, SEMESTER & AFFILIATION
// ===============================
export const getNotesByFilter = async (params = {}) => {
  try {
    return await api.get("/api/v1/notes/by-course-semester-affiliation", { params });
  } catch (err) {
    handleApiError(err);
  }
};

// ===============================
// GET SINGLE NOTE (Your custom endpoint)
// ===============================

// ===============================
// GET SINGLE NOTE (PDF file)
// ===============================
export const getSingle = async (url) => {
  try {
    const res = await api.get(url, {
      headers: {
        Accept: "application/pdf",
      },
      responseType: "blob",
      withCredentials: true,
    });

    if (res.status !== 200) {
      throw new Error(`Unexpected response status: ${res.status}`);
    }

    const contentType = res.headers["content-type"];
    if (!contentType || !contentType.includes("application/pdf")) {
      throw new Error("Invalid response: not a PDF file");
    }

    return res.data; // blob
  } catch (err) {
    handleApiError(err);
  }
};

export const getNotesById = async (noteId) => {
  try {
    return await api.get(`/api/v1/notes/${noteId}`);
  } catch (err) {
    handleApiError(err);
  }
};

// ===============================
// UPDATE NOTE DETAILS  (JSON)
// ===============================
export const updateNoteDetails = async (id, body) => {
  try {
    return await api.put(`/api/v1/notes/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    handleApiError(err);
  }
};

// ===============================
// UPDATE NOTE FILE (PDF Upload)
// ===============================
export const updateNoteFile = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    return await api.put(`/api/v1/notes/${id}/file`, formData);
  } catch (err) {
    handleApiError(err);
  }
};

// ===============================
// DELETE NOTE
// ===============================
export const deleteNote = async (id) => {
  try {
    return await api.delete(`/api/v1/notes/${id}`);
  } catch (err) {
    handleApiError(err);
  }
};
