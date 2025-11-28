import React, { useState, useEffect } from "react";

const defaultForm = {
  courseId: "",
  courseCode: "",
  courseName: "",
  syllabusTitle: "",
  creditHours: "",
  lectureHours: "",
  practicalHours: "",
  semester: "",
  year: "",
  syllabusFile: null,
};

const SyllabusForm = ({ mode = "add", initialData = null, onSubmit }) => {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({}); // One source of truth for ALL errors
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Reset form when mode or initialData changes
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({ ...defaultForm, ...initialData, syllabusFile: null });
    } else {
      setForm(defaultForm);
    }
    setErrors({});
    setSuccessMessage("");
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] || null : value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.courseCode.trim()) newErrors.courseCode = "Course code is required";
    if (!form.courseName.trim()) newErrors.courseName = "Course name is required";
    if (!form.syllabusTitle.trim()) newErrors.syllabusTitle = "Syllabus title is required";
    if (!form.semester.trim()) newErrors.semester = "Semester is required";
    if (!form.year) newErrors.year = "Year is required";

    if (mode === "add" && !form.syllabusFile) {
      newErrors.syllabusFile = "Please upload a PDF file";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrors({});

    if (!validate()) return;

    const payload = {
      syllabusTitle: form.syllabusTitle.trim(),
      subjectName: form.courseName.trim(),
      courseCode: form.courseCode.trim(),
      creditHours: form.creditHours ? Number(form.creditHours) : null,
      lectureHours: form.lectureHours ? Number(form.lectureHours) : null,
      practicalHours: form.practicalHours ? Number(form.practicalHours) : null,
      courseId: form.courseId?.trim() || "",
      semester: form.semester.trim(),
      year: Number(form.year),
    };

    const formData = new FormData();
    formData.append("syllabus", new Blob([JSON.stringify(payload)], { type: "application/json" }));
    if (form.syllabusFile) formData.append("file", form.syllabusFile);

    setSubmitting(true);

    try {
      await onSubmit(formData);
      setSuccessMessage(mode === "add" ? "Syllabus added successfully!" : "Syllabus updated successfully!");
      if (mode === "add") setForm(defaultForm);
    } catch (err) {
      let fieldErrors = {};
      let globalError = "";

      // Smart backend error handling — works for ANY field
      if (err && typeof err === "object") {
        // Case 1: { error: "Some message about courseCode" }
        if (err.error && typeof err.error === "string") {
          const msg = err.error.toLowerCase();

          // Auto-detect which field the error belongs to
          if (msg.includes("title")) fieldErrors.syllabusTitle = err.error;
          else if (msg.includes("course code") || msg.includes("code")) fieldErrors.courseCode = err.error;
          else if (msg.includes("course name") || msg.includes("subject")) fieldErrors.courseName = err.error;
          else if (msg.includes("semester")) fieldErrors.semester = err.error;
          else if (msg.includes("year")) fieldErrors.year = err.error;
          else if (msg.includes("file") || msg.includes("pdf")) fieldErrors.syllabusFile = err.error;
          else globalError = err.error; // fallback
        }
        // Case 2: { errors: { courseCode: "Duplicate", year: "Invalid" } }
        else if (err.errors && typeof err.errors === "object") {
          fieldErrors = err.errors;
        }
        // Case 3: Direct object like { courseCode: "Already exists" }
        else {
          fieldErrors = err;
        }

        if (err.message && !globalError && Object.keys(fieldErrors).length === 0) {
          globalError = err.message;
        }
      } else if (typeof err === "string") {
        globalError = err;
      }

      // Always set errors in the same object
      setErrors({
        ...fieldErrors,
        ...(globalError ? { global: globalError } : {}),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
      errors[field] ? "border-red-500 ring-red-500" : "border-gray-300"
    }`;

  return (
    <section className="w-full py-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
          <div className="bg-linear-to-r from-indigo-50 to-white px-6 py-5 border-b">
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === "edit" ? "Edit Syllabus" : "Add New Syllabus"}
            </h1>
          </div>

          <div className="p-6">
            {successMessage && (
              <div className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
                {successMessage}
              </div>
            )}

            {errors.global && (
              <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
                {errors.global}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course ID</label>
                  <input name="courseId" value={form.courseId} onChange={handleChange} className={inputClass("courseId")} />
                  {errors.courseId && <p className="mt-1 text-xs text-red-600">{errors.courseId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Code *</label>
                  <input name="courseCode" value={form.courseCode} onChange={handleChange} className={inputClass("courseCode")} placeholder="e.g. CSC-101" />
                  {errors.courseCode && <p className="mt-1 text-xs text-red-600">{errors.courseCode}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Course Name *</label>
                  <input name="courseName" value={form.courseName} onChange={handleChange} className={inputClass("courseName")} />
                  {errors.courseName && <p className="mt-1 text-xs text-red-600">{errors.courseName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Syllabus Title *</label>
                  <input name="syllabusTitle" value={form.syllabusTitle} onChange={handleChange} className={inputClass("syllabusTitle")} />
                  {errors.syllabusTitle && <p className="mt-1 text-xs text-red-600">{errors.syllabusTitle}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Semester *</label>
                  <input name="semester" value={form.semester} onChange={handleChange} className={inputClass("semester")} />
                  {errors.semester && <p className="mt-1 text-xs text-red-600">{errors.semester}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Year *</label>
                  <input type="number" name="year" value={form.year} onChange={handleChange} className={inputClass("year")} min="2000" />
                  {errors.year && <p className="mt-1 text-xs text-red-600">{errors.year}</p>}
                </div>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Credit Hours</label>
                  <input type="number" step="0.5" name="creditHours" value={form.creditHours} onChange={handleChange} className={inputClass("creditHours")} />
                  {errors.creditHours && <p className="mt-1 text-xs text-red-600">{errors.creditHours}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Lecture Hours</label>
                  <input type="number" name="lectureHours" value={form.lectureHours} onChange={handleChange} className={inputClass("lectureHours")} />
                  {errors.lectureHours && <p className="mt-1 text-xs text-red-600">{errors.lectureHours}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Practical Hours</label>
                  <input type="number" name="practicalHours" value={form.practicalHours} onChange={handleChange} className={inputClass("practicalHours")} />
                  {errors.practicalHours && <p className="mt-1 text-xs text-red-600">{errors.practicalHours}</p>}
                </div>
              </div>

              <div className="mt-7">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Syllabus PDF {mode === "edit" ? "(optional)" : "*"}
                </label>
                <label
                  htmlFor="syllabusFile"
                  className={`block border-2 border-dashed rounded-lg px-6 py-10 text-center cursor-pointer transition ${
                    errors.syllabusFile ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <p className="text-sm text-gray-600">
                    {form.syllabusFile ? form.syllabusFile.name : "Click to upload PDF"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Max 10MB</p>
                </label>
                <input
                  id="syllabusFile"
                  name="syllabusFile"
                  type="file"
                  accept="application/pdf"
                  onChange={handleChange}
                  className="hidden"
                />
                {errors.syllabusFile && <p className="mt-2 text-xs text-red-600">{errors.syllabusFile}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-8 w-full rounded-lg bg-indigo-600 py-3 text-white font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
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