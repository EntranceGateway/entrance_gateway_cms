import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

// -----------------------------
// Default Form Shape
// -----------------------------
const DEFAULT_FORM = Object.freeze({
  noteName: "",
  noteDescription: "",
  syllabusId: "",
  file: null,
  fileUrl: "",
});

// -----------------------------
// Validation Logic
// -----------------------------
const validateForm = (form, mode) => {
  const errors = {};

  if (!form.noteName.trim()) errors.noteName = "Note name is required";
  if (!form.syllabusId.trim()) errors.syllabusId = "Syllabus ID is required";

  // File only required for add mode
  if (mode === "add" && !form.file) {
    errors.file = "PDF file is required";
  }

  return errors;
};

// ==========================================================
//  COMPONENT
// ==========================================================
const NoteForm = ({ mode = "add", initialData = null, onSubmit }) => {
    const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, success: "" });

  // -----------------------------
  // Load initial data in edit mode
  // -----------------------------
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        noteName: initialData.noteName || "",
        noteDescription: initialData.noteDescription || "",
        syllabusId: initialData.syllabusId || "",
        fileUrl: initialData.fileUrl || "",
        file: null,
      });
    } else {
      setForm({
        ...DEFAULT_FORM,
        syllabusId: id || "",
      });
    }
    setErrors({});
    setStatus({ loading: false, success: "" });
  }, [mode, initialData]);

  // -----------------------------
  // Memoized Input Class Generator
  // -----------------------------
  const inputClass = useCallback(
    (field) =>
      `mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-indigo-500 
      ${errors[field] ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"}`,
    [errors]
  );

  // -----------------------------
  // Input Handler
  // -----------------------------
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] || null : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // -----------------------------
  // Create Payload Depending on Mode
  // -----------------------------
  const buildPayload = useCallback(() => {
    const json = {
      noteName: form.noteName.trim(),
      noteDescription: form.noteDescription.trim(),
      syllabusId: form.syllabusId.trim(),
    };

    // ADD MODE → Always FormData
    if (mode === "add") {
      const formData = new FormData();
      formData.append("note", new Blob([JSON.stringify(json)], { type: "application/json" }));
      formData.append("file", form.file);
      return formData;
    }

    // EDIT MODE: no new file → send JSON
    if (!form.file) return json;

    // EDIT MODE: new file → FormData
    const formData = new FormData();
    formData.append("note", new Blob([JSON.stringify(json)], { type: "application/json" }));
    formData.append("file", form.file);
    return formData;
  }, [form, mode]);

  // -----------------------------
  // Submit Handler
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(form, mode);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus({ loading: true, success: "" });

    try {
      const payload = buildPayload();
      await onSubmit(payload);

      setStatus({
        loading: false,
        success: mode === "add" ? "Note created successfully!" : "Note updated successfully!",
      });

      // Redirect to notes list after success
      setTimeout(() => {
        navigate("/notespage");
      }, 1500);
    } catch (err) {
      // Standardized backend error handling
      setErrors((prev) => ({
        ...prev,
        global:
          err?.error ||
          err?.message ||
          (typeof err === "string" ? err : "Something went wrong"),
        ...(err?.errors || {}),
      }));
      setStatus({ loading: false, success: "" });
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <section className="w-full py-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-xl border bg-white shadow-md overflow-hidden">
          {/* Header */}
          <header className="px-6 py-4 border-b bg-indigo-50">
            <h1 className="text-2xl font-semibold">
              {mode === "edit" ? "Edit Note" : "Create New Note"}
            </h1>
          </header>

          <div className="p-6">
            {/* Success */}
            {status.success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded">
                {status.success}
              </div>
            )}

            {/* Global Error */}
            {errors.global && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                {errors.global}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="grid gap-6">
                {/* Note Name */}
                <div>
                  <label className="font-medium text-sm">Note Name *</label>
                  <input
                    type="text"
                    name="noteName"
                    value={form.noteName}
                    onChange={handleChange}
                    className={inputClass("noteName")}
                  />
                  {errors.noteName && (
                    <p className="text-xs text-red-600 mt-1">{errors.noteName}</p>
                  )}
                </div>

                {/* Syllabus ID */}
                <div>
                  <label className="font-medium text-sm">Syllabus ID *</label>
                  <input
                    type="text"
                    name="syllabusId"
                    value={form.syllabusId}
                    onChange={handleChange}
                    className={inputClass("syllabusId")}
                  />
                  {errors.syllabusId && (
                    <p className="text-xs text-red-600 mt-1">{errors.syllabusId}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="font-medium text-sm">Description</label>
                  <textarea
                    name="noteDescription"
                    value={form.noteDescription}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm"
                  />
                </div>

                {/* File Section */}
                <div>
                  {mode === "edit" && form.fileUrl && (
                    <div className="mb-3">
                      <label className="text-sm font-medium">Current PDF:</label>
                      <a
                        href={form.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-blue-600 underline mt-1"
                      >
                        View File
                      </a>
                    </div>
                  )}

                  <label className="text-sm font-medium">
                    {mode === "add" ? "Upload PDF *" : "Replace PDF (optional)"}
                  </label>

                  <input
                    type="file"
                    name="file"
                    accept="application/pdf"
                    onChange={handleChange}
                    className="mt-2"
                  />

                  {errors.file && <p className="text-xs text-red-600">{errors.file}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status.loading}
                className="mt-8 w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400"
              >
                {status.loading
                  ? "Saving..."
                  : mode === "edit"
                  ? "Update Note"
                  : "Create Note"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoteForm;
