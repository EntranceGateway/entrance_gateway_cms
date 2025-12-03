import React, { useState, useEffect } from "react";

// ------------------------------
// Default Form State
// ------------------------------
const defaultForm = {
  courseId: "",
  courseCode: "",
  subjectName: "",
  syllabusTitle: "",
  creditHours: "",
  lectureHours: "",
  practicalHours: "",
  semester: "",
  year: "",
  syllabusFile: null,  // new file uploaded
  fileUrl: "",         // existing file link
};

const SyllabusForm = ({ mode = "add", initialData = null, onSubmit }) => {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // ------------------------------
  // Load Initial Data for Edit Mode
  // ------------------------------
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        ...defaultForm,
        ...Object.fromEntries(
          Object.entries(initialData).map(([k, v]) => [k, v != null ? String(v) : ""])
        ),
        syllabusFile: null,
        fileUrl: initialData.fileUrl || "",
      });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
    setSuccessMessage("");
  }, [mode, initialData]);

  // ------------------------------
  // Input Change Handler
  // ------------------------------
  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
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
    const requiredFields = ["courseCode", "subjectName", "syllabusTitle", "semester", "year"];
    requiredFields.forEach((field) => {
      if (!form[field].trim()) {
        const label = field.charAt(0).toUpperCase() + field.slice(1).replace("courseCode", "Course Code");
        newErrors[field] = `${label} is required`;
      }
    });

    if (mode === "add" && !form.syllabusFile) {
      newErrors.syllabusFile = "Please upload a PDF file";
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
        syllabusTitle: form.syllabusTitle.trim(),
        subjectName: form.subjectName.trim(),
        courseCode: form.courseCode.trim(),
        creditHours: form.creditHours ? Number(form.creditHours) : null,
        lectureHours: form.lectureHours ? Number(form.lectureHours) : null,
        practicalHours: form.practicalHours ? Number(form.practicalHours) : null,
        courseId: form.courseId.trim(),
        semester: form.semester.trim(),
        year: Number(form.year),
      };

      let payload;
      if (mode === "edit" && !form.syllabusFile) {
        // Edit mode, no new file → send JSON only
        payload = jsonPayload;
      } else {
        // Add mode OR Edit mode with new file → FormData
        const formData = new FormData();
        formData.append("syllabus", new Blob([JSON.stringify(jsonPayload)], { type: "application/json" }));
        if (form.syllabusFile) formData.append("file", form.syllabusFile);
        payload = formData;
      }

      await onSubmit(payload);

      setSuccessMessage(mode === "add" ? "Syllabus added successfully!" : "Syllabus updated successfully!");
      if (mode === "add") setForm(defaultForm);
      else setForm((prev) => ({ ...prev, syllabusFile: null }));
    } catch (err) {
      handleError(err);
    } finally {
      setSubmitting(false);
    }
  };

  // ------------------------------
  // Error Handling
  // ------------------------------
  const handleError = (err) => {
    let extractedErrors = {};
    let generalError = "";

    if (err?.error) {
      const msg = err.error.toLowerCase();
      const fieldMap = { title: "syllabusTitle", code: "courseCode", name: "subjectName", semester: "semester", year: "year", file: "syllabusFile" };
      for (const key in fieldMap) if (msg.includes(key)) extractedErrors[fieldMap[key]] = err.error;
      if (Object.keys(extractedErrors).length === 0) generalError = err.error;
    }

    if (err?.errors) extractedErrors = err.errors;
    if (!generalError && err?.message) generalError = err.message;
    if (typeof err === "string") generalError = err;

    setErrors({ ...extractedErrors, ...(generalError ? { global: generalError } : {}) });
  };

  // ------------------------------
  // Input Class
  // ------------------------------
  const inputClass = (field) =>
    `mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
      errors[field] ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
    }`;

  // ------------------------------
  // Render Helpers
  // ------------------------------
  const renderTextInput = (label, name) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input name={name} value={form[name]} onChange={handleChange} className={inputClass(name)} />
      {errors[name] && <p className="text-xs text-red-600 mt-1">{errors[name]}</p>}
    </div>
  );

  const renderNumberInput = (label, name) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input type="number" name={name} value={form[name]} onChange={handleChange} className={inputClass(name)} />
      {errors[name] && <p className="text-xs text-red-600 mt-1">{errors[name]}</p>}
    </div>
  );

  // ------------------------------
  // JSX
  // ------------------------------
  return (
    <section className="w-full py-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
          <header className="bg-linear-to-r from-indigo-50 to-white px-6 py-5 border-b">
            <h1 className="text-2xl font-bold text-gray-900">{mode === "edit" ? "Edit Syllabus" : "Add New Syllabus"}</h1>
          </header>

          <div className="p-6">
            {successMessage && <div className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-800 text-sm">{successMessage}</div>}
            {errors.global && <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-800 text-sm">{errors.global}</div>}

            <form onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5 md:grid-cols-2">
                {renderTextInput("Course ID", "courseId")}
                {renderTextInput("Course Code *", "courseCode")}
                {renderTextInput("Course Name *", "subjectName")}
                {renderTextInput("Syllabus Title *", "syllabusTitle")}
                {renderTextInput("Semester *", "semester")}
                {renderNumberInput("Year *", "year")}
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                {renderNumberInput("Credit Hours", "creditHours")}
                {renderNumberInput("Lecture Hours", "lectureHours")}
                {renderNumberInput("Practical Hours", "practicalHours")}
              </div>

              {/* FILE UPLOAD */}
              <div className="mt-6">
                {mode === "add" ? (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Syllabus PDF *</label>
                    <label htmlFor="syllabusFile" className={`block border-2 border-dashed rounded-lg px-6 py-10 text-center cursor-pointer transition ${errors.syllabusFile ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}`}>
                      <p className="text-sm text-gray-600">{form.syllabusFile ? form.syllabusFile.name : "Click to upload PDF"}</p>
                    </label>
                    <input id="syllabusFile" name="syllabusFile" type="file" accept="application/pdf" onChange={handleChange} className="hidden" />
                    {errors.syllabusFile && <p className="text-xs text-red-600 mt-1">{errors.syllabusFile}</p>}
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

              <button type="submit" disabled={submitting} className="mt-8 w-full rounded-lg bg-indigo-600 py-3 text-white font-medium hover:bg-indigo-700 disabled:bg-gray-400 transition">
                {submitting ? "Saving..." : mode === "edit" ? "Update Syllabus" : "Add Syllabus"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SyllabusForm;
