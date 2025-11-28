// src/components/CourseForm.jsx
import React, { useState, useEffect } from "react";

const defaultForm = {
  courseName: "",
  description: "",
  collegeId: "037c307a-dd76-4d5e-a986-9e8ae59ac8b2", 
  courseType: "SEMESTER",
  courseLevel: "PLUS_TWO",
};

const CourseForm = ({ mode = "add", initialData = {}, onSubmit }) => {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({}); // field-specific errors (frontend + backend)
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        courseName: initialData.courseName || "",
        description: initialData.description || "",
        collegeId: initialData.collegeId || defaultForm.collegeId,
        courseType: initialData.courseType || "SEMESTER",
        courseLevel: initialData.courseLevel || "PLUS_TWO",
      });
    }
  }, [initialData, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Remove specific field error when user types
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });

    setGlobalError("");
    setMessage("");
  };

  // ---------- FRONTEND VALIDATION ----------
  const validate = () => {
    const newErrors = {};
    if (!form.courseName.trim()) newErrors.courseName = "Course name is required.";
    else if (form.courseName.length < 3)
      newErrors.courseName = "Course name must be at least 3 characters.";

    if (!form.description.trim()) newErrors.description = "Description is required.";
    else if (form.description.length < 10)
      newErrors.description = "Description must be at least 10 characters.";

    if (!form.collegeId.trim()) newErrors.collegeId = "College ID is required.";
    else if (!/^[0-9a-fA-F-]{36}$/.test(form.collegeId))
      newErrors.collegeId = "College ID must be a valid UUID.";

    return newErrors;
  };

  // ---------- SUBMIT ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGlobalError("");
    setMessage("");

    const frontendErrors = validate();
    if (Object.keys(frontendErrors).length > 0) {
      setErrors(frontendErrors);
      return;
    }

    setLoading(true);

    try {
      await onSubmit(form);

      setMessage(mode === "edit" ? "Course updated successfully!" : "Course created successfully!");

      if (mode === "add") setForm(defaultForm);
    } catch (err) {
      console.log("ERR:", err);

      let backendFieldErrors = {};
      let backendGlobalMessage = "";

      // === Normalize backend errors ===
      if (err) {
        // Backend field errors: { errors: { field: "msg" } }
        if (err.errors && typeof err.errors === "object") {
          backendFieldErrors = err.errors;
        }

        // Backend general error: { error: "...message..." }
        if (err.error) {
          backendGlobalMessage = err.error;

          // Try to map backend global error to field (smart mapping)
          if (
            err.error.toLowerCase().includes("college") &&
            err.error.toLowerCase().includes("id")
          ) {
            backendFieldErrors.collegeId = err.error; // show under collegeId field
          }
        }

        if (err.message && !backendGlobalMessage) {
          backendGlobalMessage = err.message;
        }
      }

      setErrors(backendFieldErrors);
      setGlobalError(backendGlobalMessage);

      if (!backendFieldErrors && !backendGlobalMessage) {
        setGlobalError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (name) => errors[name];

  const inputBase =
    "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition shadow-sm";
  const labelBase = "block text-gray-900 mb-2 font-medium";
  const errorText = "text-red-700 text-sm mt-1 block font-medium";
  const errorBorder = "border-red-500 focus:border-red-500 focus:ring-red-500";
  const normalBorder = "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl max-w-lg w-full p-8">
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {mode === "edit" ? "Edit Course" : "Add New Course"}
        </h1>

        {message && (
          <p
            className={`text-center mb-4 font-semibold ${
              message.toLowerCase().includes("success")
                ? "text-green-700"
                : "text-indigo-700"
            }`}
          >
            {message}
          </p>
        )}

        {globalError && !Object.values(errors).length && (
          <span role="alert" className="block text-center mb-4 font-semibold text-red-700">
            {globalError}
          </span>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Name */}
          <div>
            <label htmlFor="courseName" className={labelBase}>Course Name *</label>
            <input
              id="courseName"
              type="text"
              name="courseName"
              value={form.courseName}
              onChange={handleChange}
              placeholder="Software Engineering"
              className={`${inputBase} ${
                fieldError("courseName") ? errorBorder : normalBorder
              }`}
            />
            {fieldError("courseName") && (
              <span className={errorText}>{fieldError("courseName")}</span>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelBase}>Description *</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Write course description..."
              rows={4}
              className={`${inputBase} ${
                fieldError("description") ? errorBorder : normalBorder
              }`}
            />
            {fieldError("description") && (
              <span className={errorText}>{fieldError("description")}</span>
            )}
          </div>

          {/* College ID */}
          <div>
            <label htmlFor="collegeId" className={labelBase}>College ID *</label>
            <input
              id="collegeId"
              type="text"
              name="collegeId"
              value={form.collegeId}
              onChange={handleChange}
              placeholder="UUID of college"
              className={`${inputBase} ${
                fieldError("collegeId") ? errorBorder : normalBorder
              }`}
            />
            {fieldError("collegeId") && (
              <span className={errorText}>{fieldError("collegeId")}</span>
            )}
          </div>

          {/* Course Type */}
          <div>
            <label htmlFor="courseType" className={labelBase}>Course Type</label>
            <select
              id="courseType"
              name="courseType"
              value={form.courseType}
              onChange={handleChange}
              className={`${inputBase} ${normalBorder}`}
            >
              <option value="SEMESTER">Semester</option>
              <option value="ANNUAL">Annual</option>
            </select>
          </div>

          {/* Course Level */}
          <div>
            <label htmlFor="courseLevel" className={labelBase}>Course Level</label>
            <select
              id="courseLevel"
              name="courseLevel"
              value={form.courseLevel}
              onChange={handleChange}
              className={`${inputBase} ${normalBorder}`}
            >
              <option value="PLUS_TWO">Plus Two</option>
              <option value="BACHELOR">Bachelor</option>
              <option value="MASTER">Master</option>
              <option value="PHD">PhD</option>
              <option value="DIPLOMA">Diploma</option>
              <option value="M_PHIL">M.Phil</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            {loading
              ? mode === "edit"
                ? "Updating..."
                : "Submitting..."
              : mode === "edit"
              ? "Update Course"
              : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
