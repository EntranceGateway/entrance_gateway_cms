import React, { useState, useEffect } from "react";

const defaultForm = {
  noteName: "",
  noteDescription: "",
  syllabusId: "",
  file: null,      
  fileUrl: "",    
};

const NoteForm = ({ mode = "add", initialData = null, onSubmit }) => {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // ------------------------------
  // Load initial data for edit
  // ------------------------------
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        ...defaultForm,
        ...Object.fromEntries(
          Object.entries(initialData).map(([k, v]) => [k, v != null ? String(v) : ""])
        ),
        file: null,
        fileUrl: initialData.fileUrl || "",
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
    setSuccessMessage("");
  }, [mode, initialData]);

  // ------------------------------
  // Input Handlers
  // ------------------------------
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] || null : String(value),
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // ------------------------------
  // Validation
  // ------------------------------
  const validate = () => {
    const newErrors = {};
    const requiredFields = ["noteName", "syllabusId"];
    requiredFields.forEach((field) => {
      if (!form[field].trim()) {
        const label = field === "noteName" ? "Note Name" : "Syllabus ID";
        newErrors[field] = `${label} is required`;
      }
    });

    if (mode === "add" && !form.file) {
      newErrors.file = "Please upload a PDF file";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------------------
  // Submit Handler
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");
    if (!validate()) return;
    setSubmitting(true);

    try {
      const jsonPayload = {
        noteName: form.noteName.trim(),
        noteDescription: form.noteDescription.trim(),
        syllabusId: form.syllabusId.trim(),
      };

      let payload;
      if (mode === "edit" && !form.file) {
        payload = jsonPayload;
      } else {
        const formData = new FormData();
        formData.append("note", new Blob([JSON.stringify(jsonPayload)], { type: "application/json" }));
        if (form.file) formData.append("file", form.file);
        payload = formData;
      }

      await onSubmit(payload);

      setSuccessMessage(mode === "add" ? "Note added successfully!" : "Note updated successfully!");
      if (mode === "add") setForm(defaultForm);
      else setForm((prev) => ({ ...prev, file: null }));
    } catch (err) {
      handleError(err);
    } finally {
      setSubmitting(false);
    }
  };

  // ------------------------------
  // Error Handler
  // ------------------------------
  const handleError = (err) => {
    let extractedErrors = {};
    let generalError = "";

    if (err?.error) {
      const msg = err.error.toLowerCase();
      const fieldMap = { name: "noteName", syllabus: "syllabusId", file: "file" };
      for (const key in fieldMap) if (msg.includes(key)) extractedErrors[fieldMap[key]] = err.error;
      if (Object.keys(extractedErrors).length === 0) generalError = err.error;
    }

    if (err?.errors) extractedErrors = err.errors;
    if (!generalError && err?.message) generalError = err.message;
    if (typeof err === "string") generalError = err;

    setErrors({ ...extractedErrors, ...(generalError ? { global: generalError } : {}) });
  };

  // ------------------------------
  // Input class
  // ------------------------------
  const inputClass = (field) =>
    `mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
      errors[field] ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
    }`;

  // ------------------------------
  // JSX
  // ------------------------------
  return (
    <section className="w-full py-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
          <header className="bg-linear-to-r from-indigo-50 to-white px-6 py-5 border-b">
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === "edit" ? "Edit Note" : "Add New Note"}
            </h1>
          </header>

          <div className="p-6">
            {successMessage && (
              <div className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-800 text-sm">
                {successMessage}
              </div>
            )}
            {errors.global && (
              <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-800 text-sm">
                {errors.global}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5 md:grid-cols-2">
                {/* Note Name */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium">Note Name *</label>
                  <input
                    type="text"
                    name="noteName"
                    value={form.noteName}
                    onChange={handleChange}
                    className={inputClass("noteName")}
                  />
                  {errors.noteName && <p className="text-xs text-red-600 mt-1">{errors.noteName}</p>}
                </div>

                {/* Syllabus ID */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium">Syllabus ID *</label>
                  <input
                    type="text"
                    name="syllabusId"
                    value={form.syllabusId}
                    onChange={handleChange}
                    placeholder="e.g. 176a8e40-ccb9-478a-9daf-25c1b65b43c1"
                    className={inputClass("syllabusId")}
                  />
                  {errors.syllabusId && <p className="text-xs text-red-600 mt-1">{errors.syllabusId}</p>}
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
              </div>

              {/* File Upload */}
              <div className="mt-6">
                {mode === "add" ? (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload PDF *</label>
                    <label
                      htmlFor="file"
                      className={`block border-2 border-dashed rounded-lg px-6 py-10 text-center cursor-pointer transition ${
                        errors.file ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <p className="text-sm text-gray-600">{form.file ? form.file.name : "Click to upload PDF"}</p>
                    </label>
                    <input id="file" name="file" type="file" accept="application/pdf" onChange={handleChange} className="hidden" />
                    {errors.file && <p className="text-xs text-red-600 mt-1">{errors.file}</p>}
                  </>
                ) : (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Uploaded PDF</label>
                    {form.fileUrl ? (
                      <a href={form.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                        View Existing PDF
                      </a>
                    ) : (
                      <p className="text-gray-500">No PDF uploaded</p>
                    )}
                  </>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-8 w-full rounded-lg bg-indigo-600 py-3 text-white font-medium hover:bg-indigo-700 disabled:bg-gray-400 transition"
              >
                {submitting ? "Saving..." : mode === "edit" ? "Update Note" : "Add Note"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NoteForm;
