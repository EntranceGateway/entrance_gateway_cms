import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourses } from "../../../../http/course";

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

// ------------------------------
// Default Form State
// ------------------------------
const DEFAULT_FORM = Object.freeze({
  affiliation: "",
  courseId: "",
  courseCode: "",
  subjectName: "",
  syllabusTitle: "",
  creditHours: "",
  lectureHours: "",
  practicalHours: "",
  semester: "",
  year: "",
  syllabusFile: null,
  fileUrl: "",
});

// ------------------------------
// Validation
// ------------------------------
const validateForm = (form, mode) => {
  const errors = {};

  if (!form.courseId) {
    errors.courseId = "Course is required";
  }

  if (!form.courseCode.trim()) {
    errors.courseCode = "Course code is required";
  }

  if (!form.subjectName.trim()) {
    errors.subjectName = "Subject name is required";
  }

  if (!form.syllabusTitle.trim()) {
    errors.syllabusTitle = "Syllabus title is required";
  }

  if (!form.creditHours || parseFloat(form.creditHours) < 0) {
    errors.creditHours = "Credit hours is required and must be non-negative";
  }

  if (!form.lectureHours || parseInt(form.lectureHours) < 0) {
    errors.lectureHours = "Lecture hours is required and must be non-negative";
  }

  if (!form.practicalHours || parseInt(form.practicalHours) < 0) {
    errors.practicalHours = "Practical hours is required and must be non-negative";
  }

  if (mode === "add" && !form.syllabusFile) {
    errors.syllabusFile = "Please upload a PDF file";
  }

  return errors;
};

// ==========================================================
//  COMPONENT
// ==========================================================
const SyllabusForm = ({ mode = "add", initialData = null, onSubmit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, success: "" });

  // Dropdown data
  const [allCourses, setAllCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch all courses on mount
  useEffect(() => {
    const fetchAllCourses = async () => {
      setLoadingCourses(true);
      try {
        const res = await getCourses({ size: 100 }, token);
        const data = res.data.data?.content || res.data.data || [];
        setAllCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setAllCourses([]);
      }
      setLoadingCourses(false);
    };
    fetchAllCourses();
  }, [token]);

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

  // ------------------------------
  // Load initial data in edit mode OR set courseId from URL in add mode
  // ------------------------------
  useEffect(() => {
    if (mode === "edit" && initialData) {
      // Find the course to get its affiliation
      const course = allCourses.find(c => c.courseId === initialData.courseId);
      setForm({
        ...DEFAULT_FORM,
        ...Object.fromEntries(
          Object.entries(initialData).map(([k, v]) => [k, v != null ? String(v) : ""])
        ),
        affiliation: course?.affiliation || initialData.affiliation || "",
        syllabusFile: null,
        fileUrl: initialData.fileUrl || "",
      });
    } else {
      setForm({
        ...DEFAULT_FORM,
        courseId: id || "",
      });
    }
    setErrors({});
    setStatus({ loading: false, success: "" });
  }, [mode, initialData, id, allCourses]);

  // ------------------------------
  // Input Class Generator
  // ------------------------------
  const inputClass = useCallback(
    (field) =>
      `mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        errors[field] ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
      }`,
    [errors]
  );

  // ------------------------------
  // Input Handler
  // ------------------------------
  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    
    if (name === "affiliation") {
      // Reset courseId when affiliation changes
      setForm((prev) => ({
        ...prev,
        affiliation: value,
        courseId: "",
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "file" ? files[0] || null : String(value),
      }));
    }
    
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // ------------------------------
  // Build Payload
  // ------------------------------
  const buildPayload = useCallback(() => {
    const jsonPayload = {
      courseId: form.courseId,
      courseCode: form.courseCode.trim(),
      subjectName: form.subjectName.trim(),
      syllabusTitle: form.syllabusTitle.trim(),
      creditHours: form.creditHours ? Number(form.creditHours) : 0,
      lectureHours: form.lectureHours ? Number(form.lectureHours) : 0,
      practicalHours: form.practicalHours ? Number(form.practicalHours) : 0,
      semester: form.semester ? Number(form.semester) : null,
      year: form.year ? Number(form.year) : null,
    };

    if (mode === "add" || form.syllabusFile) {
      const formData = new FormData();
      formData.append("syllabus", new Blob([JSON.stringify(jsonPayload)], { type: "application/json" }));
      if (form.syllabusFile) formData.append("file", form.syllabusFile);
      return formData;
    }

    // Edit mode, no new file → send JSON
    return jsonPayload;
  }, [form, mode]);

  // ------------------------------
  // Submit Handler
  // ------------------------------
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
        success: mode === "add" ? "Syllabus added successfully!" : "Syllabus updated successfully!",
      });

      // Redirect to syllabus list after success
      setTimeout(() => {
        navigate("/syllabus/all");
      }, 1500);
    } catch (err) {
      // Standardized error handling
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
            <h1 className="text-2xl font-bold text-gray-900">
              {mode === "edit" ? "Edit Syllabus" : "Add New Syllabus"}
            </h1>
          </header>

          <div className="p-6">
            {status.success && (
              <div className="mb-5 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-800 text-sm">
                {status.success}
              </div>
            )}
            {errors.global && (
              <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-800 text-sm">
                {errors.global}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Affiliation & Course Selection */}
              <div className="grid gap-5 md:grid-cols-2 mb-6">
                {/* Affiliation */}
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
                  {errors.affiliation && <p className="text-xs text-red-600 mt-1">{errors.affiliation}</p>}
                </div>

                {/* Course */}
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
                        ? "Select affiliation first"
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
                  {errors.courseId && <p className="text-xs text-red-600 mt-1">{errors.courseId}</p>}
                </div>
              </div>

              {/* Course Details */}
              <div className="grid gap-5 md:grid-cols-2">
                {renderTextInput("Course Code *", "courseCode")}
                {renderTextInput("Subject Name *", "subjectName")}
                {renderTextInput("Syllabus Title *", "syllabusTitle")}
                {renderNumberInput("Semester", "semester")}
                {renderNumberInput("Year", "year")}
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                {renderNumberInput("Credit Hours *", "creditHours")}
                {renderNumberInput("Lecture Hours *", "lectureHours")}
                {renderNumberInput("Practical Hours *", "practicalHours")}
              </div>

              {/* FILE UPLOAD */}
              <div className="mt-6">
                {mode === "edit" && form.fileUrl && (
                  <div className="mb-3">
                    <label className="text-sm font-medium">Current PDF:</label>
                    <a href={form.fileUrl} target="_blank" rel="noreferrer" className="block text-blue-600 underline mt-1">
                      View File
                    </a>
                  </div>
                )}

                <label className="block text-sm font-medium">
                  {mode === "add" ? "Upload PDF *" : "Replace PDF (optional)"}
                </label>
                <input type="file" name="syllabusFile" accept="application/pdf" onChange={handleChange} className="mt-2" />
                {errors.syllabusFile && <p className="text-xs text-red-600 mt-1">{errors.syllabusFile}</p>}
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className="mt-8 w-full rounded-lg bg-indigo-600 py-3 text-white font-medium hover:bg-indigo-700 disabled:bg-gray-400 transition"
              >
                {status.loading ? "Saving..." : mode === "edit" ? "Update Syllabus" : "Add Syllabus"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SyllabusForm;