// src/pages/notes/components/form/NotesFrom.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import { BookOpen, AlertCircle, Save, FileText } from "lucide-react";

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
  if (!form.syllabusId || String(form.syllabusId).trim() === "") errors.syllabusId = "Syllabus ID is required";

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
        syllabusId: String(initialData.syllabusId || ""),
        fileUrl: initialData.fileUrl || "",
        file: null,
      });
    } else if (mode === "add" && initialData?.syllabusId) {
      // Pre-fill syllabusId when coming from syllabus table
      setForm({
        ...DEFAULT_FORM,
        syllabusId: String(initialData.syllabusId || id || ""),
      });
    } else {
      setForm({
        ...DEFAULT_FORM,
        syllabusId: String(id || ""),
      });
    }
    setErrors({});
    setStatus({ loading: false, success: "" });
  }, [mode, initialData, id]);

  // -----------------------------
  // Memoized Input Class Generator
  // -----------------------------
  const inputClass = useCallback(
    (field) =>
      `block w-full rounded-xl border px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
        errors[field] ? "border-red-300 ring-red-200" : "border-gray-200 bg-gray-50/50 focus:bg-white"
      }`,
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
      syllabusId: String(form.syllabusId).trim(),
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
    <div className="w-full">
      <PageHeader
        title={mode === "edit" ? "Edit Note" : "Create New Note"}
        subtitle={mode === "edit" ? "Update note details and documents" : "Upload new study materials"}
        breadcrumbs={[
            { label: "Notes", to: "/notespage" },
            { label: mode === "edit" ? "Edit" : "Add" }
        ]}
        icon={BookOpen}
      />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden p-8">
            {/* Success */}
            {status.success && (
              <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-800 text-sm flex items-center gap-2">
                <Save size={16} />
                {status.success}
              </div>
            )}

            {/* Global Error */}
            {errors.global && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-800 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {errors.global}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Note Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Note Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="noteName"
                        value={form.noteName}
                        onChange={handleChange}
                        className={inputClass("noteName")}
                        placeholder="e.g. Chapter 1 Summary"
                      />
                      {errors.noteName && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.noteName}</p>
                      )}
                    </div>

                    {/* Syllabus ID */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Syllabus ID <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="syllabusId"
                        value={form.syllabusId}
                        onChange={handleChange}
                        className={inputClass("syllabusId")}
                        placeholder="Associated Syllabus ID"
                      />
                      {errors.syllabusId && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.syllabusId}</p>
                      )}
                    </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                  <textarea
                    name="noteDescription"
                    value={form.noteDescription}
                    onChange={handleChange}
                    rows={4}
                    className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Brief description of the note content..."
                  />
                </div>

                {/* File Section */}
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Documents</h3>
                  <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-indigo-300 transition-colors bg-gray-50/30">
                      {mode === "edit" && form.fileUrl && (
                        <div className="mb-4 flex items-center gap-2 text-indigo-600 bg-indigo-50 w-fit px-3 py-1.5 rounded-lg text-sm font-medium">
                          <FileText size={16} />
                          <a
                            href={form.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="underline"
                          >
                            View Current PDF
                          </a>
                        </div>
                      )}

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {mode === "add" ? "Upload PDF *" : "Replace PDF (optional)"}
                      </label>

                      <input
                        type="file"
                        name="file"
                        accept="application/pdf"
                        onChange={handleChange}
                        className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2.5 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100 transition-colors"
                      />

                      {errors.file && <p className="text-xs text-red-600 mt-2 flex items-center gap-1"><AlertCircle size={10} /> {errors.file}</p>}
                  </div>
                </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => navigate("/notespage")}
                    className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status.loading}
                    className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
                  >
                    {status.loading ? "Processing..." : (
                        <>
                            <Save size={18} />
                            {mode === "edit" ? "Update Note" : "Create Note"}
                        </>
                    )}
                  </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default NoteForm;
