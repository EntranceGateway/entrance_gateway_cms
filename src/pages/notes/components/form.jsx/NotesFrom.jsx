import { useState, useEffect } from "react";

const NoteForm = ({ onSubmit, mode, initialData }) => {
  const [form, setForm] = useState({
    noteName: "",
    noteDescription: "",
    syllabusId: "",
    file: null,
  });

  const [errors, setErrors] = useState({});

  // Load data when editing
  useEffect(() => {
    if (initialData) {
      setForm({
        noteName: initialData.noteName || "",
        noteDescription: initialData.noteDescription || "",
        syllabusId: initialData.syllabusId || "",
        file: null, // File never comes from backend
      });
    }
  }, [initialData]);

  // ---------------------------
  // Input Handlers
  // ---------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setErrors({ ...errors, file: "PDF file is required." });
      return;
    }

    if (file.type !== "application/pdf") {
      setErrors({ ...errors, file: "Only PDF file allowed." });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors({ ...errors, file: "Max file size is 2MB." });
      return;
    }

    setForm({ ...form, file });
    setErrors({ ...errors, file: "" });
  };

  // ---------------------------
  // Validation
  // ---------------------------
  const validate = () => {
    let temp = {};

    if (!form.noteName.trim()) temp.noteName = "Note name is required.";

    if (!form.syllabusId.trim())
      temp.syllabusId = "Syllabus ID (UUID) is required.";

    if (!form.file && mode === "add")
      temp.file = "PDF file is required for new notes.";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ---------------------------
  // Submit Handler
  // ---------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const fd = new FormData();
    fd.append("noteName", form.noteName);
    fd.append("noteDescription", form.noteDescription);
    fd.append("syllabusId", form.syllabusId);

    if (form.file) fd.append("file", form.file);

    onSubmit?.(fd);
  };

  const inputBorder = (field) => {
    if (errors[field]) return "border-red-500";
    if (form[field] && !errors[field]) return "border-green-500";
    return "border-gray-300";
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 border-b pb-2">
        {mode === "add" ? "Create Note" : "Update Note"}
      </h2>

      <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>

        {/* Note Name */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">Note Name *</label>
          <input
            type="text"
            name="noteName"
            value={form.noteName}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded-lg ${inputBorder("noteName")}`}
          />
          {errors.noteName && <p className="text-red-600 text-sm">{errors.noteName}</p>}
        </div>

        {/* Syllabus ID */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">Syllabus ID (UUID) *</label>
          <input
            type="text"
            name="syllabusId"
            value={form.syllabusId}
            onChange={handleChange}
            placeholder="e.g. 176a8e40-ccb9-478a-9daf-25c1b65b43c1"
            className={`w-full border px-3 py-2 rounded-lg ${inputBorder("syllabusId")}`}
          />
          {errors.syllabusId && (
            <p className="text-red-600 text-sm">{errors.syllabusId}</p>
          )}
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">Note Description</label>
          <textarea
            name="noteDescription"
            value={form.noteDescription}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg h-32"
          ></textarea>
        </div>

        {/* File Upload */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">Upload PDF *</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className={`w-full border px-3 py-2 rounded-lg bg-gray-50 ${inputBorder("file")}`}
          />
          {errors.file && <p className="text-red-600 text-sm">{errors.file}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="sm:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-lg font-semibold"
        >
          {mode === "add" ? "Submit Note" : "Update Note"}
        </button>
      </form>
    </div>
  );
};

export default NoteForm;
