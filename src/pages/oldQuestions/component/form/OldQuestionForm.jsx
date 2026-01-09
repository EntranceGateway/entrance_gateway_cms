import React, { useState, useEffect, useCallback } from "react";

import { useNavigate } from "react-router-dom";
import { getCourses } from "../../../../http/course";
import { getSyllabusByCourseId } from "../../../../http/syllabus";

// Affiliation options
const AFFILIATIONS = [
  { value: "TRIBHUVAN_UNIVERSITY", label: "Tribhuvan University" },
  { value: "POKHARA_UNIVERSITY", label: "Pokhara University" },
  { value: "KATHMANDU_UNIVERSITY", label: "Kathmandu University" },
  { value: "PURWANCHAL_UNIVERSITY", label: "Purwanchal University" },
  { value: "MID_WESTERN_UNIVERSITY", label: "Mid Western University" },
  { value: "FAR_WESTERN_UNIVERSITY", label: "Far Western University" },
  { value: "LUMBINI_UNIVERSITY", label: "Lumbini University" },
  { value: "CAMPUS_AFFILIATED_TO_FOREIGN_UNIVERSITY", label: "Foreign University" },
];

// Default Form State
const DEFAULT_FORM = Object.freeze({
  affiliation: "",
  setName: "",
  description: "",
  year: "",
  syllabusId: "",
  courseId: "",
  file: null,
  existingPdfPath: "",
});

// Validation
const validateForm = (form, mode) => {
  const errors = {};

  if (!form.setName.trim()) {
    errors.setName = "Set name is required";
  }

  if (!form.year || form.year < 1990 || form.year > 2100) {
    errors.year = "Year must be between 1990 and 2100";
  }

  if (!form.syllabusId) {
    errors.syllabusId = "Syllabus is required";
  }

  if (!form.courseId) {
    errors.courseId = "Course is required";
  }

  if (mode === "add" && !form.file) {
    errors.file = "Please upload a PDF file";
  }

  return errors;
};

const OldQuestionForm = ({ mode = "add", initialData = null, onSubmit }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, success: "" });

  // Dropdown data
  const [courses, setCourses] = useState([]);
  const [syllabi, setSyllabi] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingSyllabi, setLoadingSyllabi] = useState(false);



  // All courses (fetched once)
  const [allCourses, setAllCourses] = useState([]);

  // Fetch all courses on mount
  useEffect(() => {
    const fetchAllCourses = async () => {
      setLoadingCourses(true);
      try {
        const res = await getCourses({ size: 100 });
        const data = res.data.data?.content || res.data.data || [];
        setAllCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setAllCourses([]);
      }
      setLoadingCourses(false);
    };
    fetchAllCourses();
  }, []);

  // Filter courses when affiliation changes
  useEffect(() => {
    if (!form.affiliation) {
      setCourses([]);
      return;
    }
    const filtered = allCourses.filter(
      (c) => c.affiliation === form.affiliation
    );
    setCourses(filtered);
  }, [form.affiliation, allCourses]);

  // Fetch syllabus when course changes
  useEffect(() => {
    const fetchSyllabi = async () => {
      if (!form.courseId) {
        setSyllabi([]);
        return;
      }

      setLoadingSyllabi(true);
      try {
        // Fetch syllabus by course ID
        const res = await getSyllabusByCourseId(form.courseId, {});
        // Handle different response structures
        const data = res.data.data?.content || res.data.data || res.data.content || res.data || [];
        setSyllabi(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching syllabi:", err);
        setSyllabi([]);
      }
      setLoadingSyllabi(false);
    };
    fetchSyllabi();
  }, [form.courseId]);

  // Load initial data in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        ...DEFAULT_FORM,
        setName: initialData.setName || "",
        description: initialData.description || "",
        year: initialData.year?.toString() || "",
        syllabusId: initialData.syllabusId || "",
        courseId: initialData.courseId || "",
        existingPdfPath: initialData.pdfFilePath || "",
        file: null,
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setErrors({});
    setStatus({ loading: false, success: "" });
  }, [mode, initialData]);

  // Input class generator
  const inputClass = useCallback(
    (field) =>
      `mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors[field] ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
      }`,
    [errors]
  );

  // Handle input changes
  const handleChange = (e) => {
    const { name, type, files, value } = e.target;

    if (name === "affiliation") {
      // Reset courseId and syllabusId when affiliation changes
      setForm((prev) => ({
        ...prev,
        affiliation: value,
        courseId: "",
        syllabusId: "",
      }));
    } else if (name === "courseId") {
      // Reset syllabusId when course changes
      setForm((prev) => ({
        ...prev,
        courseId: value,
        syllabusId: "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "file" ? files[0] || null : value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Build form data for submission
  const buildFormData = () => {
    const fd = new FormData();

    const requestData = {
      setName: form.setName.trim(),
      description: form.description.trim(),
      year: parseInt(form.year),
      syllabusId: form.syllabusId,
      courseId: form.courseId,
    };

    fd.append(
      "data",
      new Blob([JSON.stringify(requestData)], { type: "application/json" })
    );

    if (form.file) {
      fd.append("file", form.file);
    }

    return fd;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(form, mode);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus({ loading: true, success: "" });

    try {
      const formData = buildFormData();
      await onSubmit(formData);

      setStatus({
        loading: false,
        success: mode === "add" ? "Old question added successfully!" : "Old question updated successfully!",
      });

      // Redirect after success
      setTimeout(() => {
        navigate("/old-questions/all");
      }, 1500);
    } catch (err) {
      setStatus({ loading: false, success: "" });

      // Handle backend validation errors
      if (err.response?.data?.errors) {
        const backendErrors = {};
        err.response.data.errors.forEach((error) => {
          backendErrors[error.field] = error.message;
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: err.message || "Something went wrong" });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-8 space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">
        {mode === "add" ? "Add Old Question" : "Edit Old Question"}
      </h2>

      {/* Success Message */}
      {status.success && (
        <div className="p-4 bg-green-100 text-green-700 rounded-lg">
          {status.success}
        </div>
      )}

      {/* General Error */}
      {errors.general && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {errors.general}
        </div>
      )}

      {/* Affiliation Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Affiliation <span className="text-red-500">*</span>
        </label>
        <select
          name="affiliation"
          value={form.affiliation}
          onChange={handleChange}
          className={inputClass("affiliation")}
        >
          <option value="">Select an affiliation</option>
          {AFFILIATIONS.map((aff) => (
            <option key={aff.value} value={aff.value}>
              {aff.label}
            </option>
          ))}
        </select>
        {errors.affiliation && (
          <p className="mt-1 text-sm text-red-600">{errors.affiliation}</p>
        )}
      </div>

      {/* Course Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Course <span className="text-red-500">*</span>
        </label>
        <select
          name="courseId"
          value={form.courseId}
          onChange={handleChange}
          disabled={!form.affiliation || loadingCourses}
          className={inputClass("courseId")}
        >
          <option value="">
            {!form.affiliation
              ? "Select an affiliation first"
              : loadingCourses
                ? "Loading courses..."
                : "Select a course"}
          </option>
          {courses.map((course) => (
            <option key={course.courseId} value={course.courseId}>
              {course.courseName}
            </option>
          ))}
        </select>
        {errors.courseId && (
          <p className="mt-1 text-sm text-red-600">{errors.courseId}</p>
        )}
      </div>

      {/* Syllabus Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Syllabus (Subject) <span className="text-red-500">*</span>
        </label>
        <select
          name="syllabusId"
          value={form.syllabusId}
          onChange={handleChange}
          disabled={!form.courseId || loadingSyllabi}
          className={inputClass("syllabusId")}
        >
          <option value="">
            {!form.courseId
              ? "Select a course first"
              : loadingSyllabi
                ? "Loading syllabi..."
                : "Select a syllabus"}
          </option>
          {syllabi.map((syllabus) => (
            <option key={syllabus.syllabusId} value={syllabus.syllabusId}>
              {syllabus.subjectName || syllabus.syllabusTitle} - Sem {syllabus.semester}
            </option>
          ))}
        </select>
        {errors.syllabusId && (
          <p className="mt-1 text-sm text-red-600">{errors.syllabusId}</p>
        )}
      </div>

      {/* Set Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Set Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="setName"
          value={form.setName}
          onChange={handleChange}
          placeholder="e.g., Set A, Model Question 2024"
          className={inputClass("setName")}
        />
        {errors.setName && (
          <p className="mt-1 text-sm text-red-600">{errors.setName}</p>
        )}
      </div>

      {/* Year */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Year <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="year"
          value={form.year}
          onChange={handleChange}
          placeholder="e.g., 2024"
          min="1990"
          max="2100"
          className={inputClass("year")}
        />
        {errors.year && (
          <p className="mt-1 text-sm text-red-600">{errors.year}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Optional description..."
          rows="3"
          className={inputClass("description")}
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          PDF File {mode === "add" && <span className="text-red-500">*</span>}
        </label>

        {mode === "edit" && form.existingPdfPath && (
          <div className="mb-2 p-2 bg-gray-50 rounded-lg text-sm text-gray-600">
            Current file: {form.existingPdfPath.split("/").pop()}
          </div>
        )}

        <input
          type="file"
          name="file"
          onChange={handleChange}
          accept=".pdf,application/pdf"
          className={inputClass("file")}
        />
        {errors.file && (
          <p className="mt-1 text-sm text-red-600">{errors.file}</p>
        )}
        {mode === "edit" && (
          <p className="mt-1 text-xs text-gray-500">
            Leave empty to keep the existing file
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={status.loading}
          className="flex-1 py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {status.loading
            ? "Saving..."
            : mode === "add"
              ? "Add Old Question"
              : "Update Old Question"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/old-questions/all")}
          className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default OldQuestionForm;
