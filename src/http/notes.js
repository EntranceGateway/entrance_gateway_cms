import api from "./index"; // axios instance

// ===============================
// CREATE NOTE  (JSON + File)
// ===============================
export const createNote = async (formData, token) => {
  try {
    return await api.post("/api/v1/notes", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ Don't manually set Content-Type for FormData
      },
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// GET ALL NOTES
// ===============================
export const getNotes = async (params = {}, token) => {
  try {
    return await api.get("/api/v1/notes", {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// GET SINGLE NOTE (Your custom endpoint)
// ===============================

//export const getSingle = async (noteId, token) => {
//   try {
//     return await api.get(`/api/v1/notes/getNotefile/${noteId}`, {
//       headers: token ? { Authorization: `Bearer ${token}` } : {},
//       responseType: "blob", // IMPORTANT: get file as binary
//     });
//   } catch (err) {
//     throw err.response?.data || err;
//   }
// };
// export const getSingle = async (noteId, token) => {
//   try {
//     return await api.get(`/api/v1/notes/getNotefile/${noteId}`, {
//       headers: token ? { Authorization: `Bearer ${token}` } : {},
//       responseType: "blob", // IMPORTANT: get file as binary
//     });
//   } catch (err) {
//     console.error("Error fetching PDF:", err);
//     throw err.response?.data || err;
//   }
// };


// src/http/notes/getSingle.js

export const getSingle = async (url, token) => {
 if (!token) throw new Error("Authentication token is missing");

  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/pdf",
    },
    responseType: "blob",
    withCredentials: true, // ✅ matches access-control-allow-credentials: true
  });

  if (res.status !== 200) {
    throw new Error(`Unexpected response status: ${res.status}`);
  }

  const contentType = res.headers["content-type"];
  if (!contentType || !contentType.includes("application/pdf")) {
    throw new Error("Invalid response: not a PDF file");
  }

  return res.data; // blob

};

export const getNotesById = async (noteId, token) => {
  try {
    return await api.get(`/api/v1/notes/${noteId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// UPDATE NOTE DETAILS  (JSON)
// ===============================
export const updateNoteDetails = async (id, body, token) => {
  try {
    return await api.put(`/api/v1/notes/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// UPDATE NOTE FILE (PDF Upload)
// ===============================
export const updateNoteFile = async (id, file, token) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    return await api.put(`/api/v1/notes/${id}/file`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ No manual Content-Type → browser handles it
      },
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};

// ===============================
// DELETE NOTE
// ===============================
export const deleteNote = async (id, token) => {
  try {
    return await api.delete(`/api/v1/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    throw err.response?.data || err;
  }
};
