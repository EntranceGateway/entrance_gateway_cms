import api from "./index"; // axios instance

export const getSingle = async (url, token) => {
 if (!token) throw new Error("Authentication token is missing");

  const res = await api.get(url, {
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

const noteFile="/api/v1/notes/getNotefile"
const syllabusFile="/api/v1/syllabus/getSyllabusFile"
const noticeFile="/api/v1/notices/getNoticeFile"

export {
    noteFile,
    syllabusFile,
    noticeFile
}