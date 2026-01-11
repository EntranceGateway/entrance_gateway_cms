// src/components/SyllabusForm.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourses } from "../../../../http/course";
import PageHeader from "@/components/common/PageHeader";
import { BookOpen, AlertCircle, Save, FileText } from "lucide-react";

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

  if (!form.courseId) errors.courseId = "Course is required";
  if (!form.courseCode.trim()) errors.courseCode = "Course code is required";
  if (!form.subjectName.trim()) errors.subjectName = "Subject name is required";
  if (!form.syllabusTitle.trim()) errors.syllabusTitle = "Syllabus title is required";

  if (!form.creditHours || parseFloat(form.creditHours) < 0) {
    errors.creditHours = "Credit hours required (≥ 0)";
  }
  if (!form.lectureHours || parseInt(form.lectureHours) < 0) {
    errors.lectureHours = "Lecture hours required (≥ 0)";
  }
  if (!form.practicalHours || parseInt(form.practicalHours) < 0) {
    errors.practicalHours = "Practical hours required (≥ 0)";
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

  // Load initial data in edit mode OR set courseId from URL in add mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
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

  // Input Class Generator
  const inputClass = useCallback(
    (field) =>
      `block w-full rounded-xl border px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
        errors[field] ? "border-red-300 ring-red-200" : "border-gray-200 bg-gray-50/50 focus:bg-white"
      }`,
    [errors]
  );

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;

    if (name === "affiliation") {
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

    return jsonPayload;
  }, [form, mode]);

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

      setTimeout(() => {
        navigate("/syllabus/all");
      }, 1500);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        global: err?.error || err?.message || (typeof err === "string" ? err : "Something went wrong"),
        ...(err?.errors || {}),
      }));
      setStatus({ loading: false, success: "" });
    }
  };

  const renderTextInput = (label, name, placeholder = "") => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label} <span className="text-red-500">*</span></label>
      <input 
        name={name} 
        value={form[name]} 
        onChange={handleChange} 
        className={inputClass(name)} 
        placeholder={placeholder}
      />
      {errors[name] && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors[name]}</p>}
    </div>
  );

  const renderNumberInput = (label, name) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <input 
        type="number" 
        name={name} 
        value={form[name]} 
        onChange={handleChange} 
        className={inputClass(name)} 
        min="0"
      />
      {errors[name] && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors[name]}</p>}
    </div>
  );

  return (
    <div className="w-full">
      <PageHeader
        title={mode === "edit" ? "Edit Syllabus" : "Add New Syllabus"}
        subtitle={mode === "edit" ? "Update syllabus details and files" : "Upload new syllabus materials"}
        breadcrumbs={[
            { label: "Syllabus", to: "/syllabus/all" },
            { label: mode === "edit" ? "Edit" : "Add" }
        ]}
        icon={FileText}
      />

      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden p-8">
            {status.success && (
              <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-800 text-sm flex items-center gap-2">
                <Save size={16} />
                {status.success}
              </div>
            )}
            {errors.global && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-800 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {errors.global}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              {/* Course Selection Section */}
              <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Course Selection</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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
              </div>

              {/* Syllabus Details */}
              <div className="space-y-6">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Syllabus Details</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    {renderTextInput("Syllabus Title", "syllabusTitle", "e.g. Introduction to Programming")}
                    {renderTextInput("Subject Name", "subjectName", "e.g. C Programming")}
                    {renderTextInput("Course Code", "courseCode", "e.g. CSC-101")}
                    
                    <div className="grid grid-cols-2 gap-4">
                        {renderNumberInput("Semester", "semester")}
                        {renderNumberInput("Year", "year")}
                    </div>
                  </div>

                  <div className="grid gap-6 grid-cols-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    {renderNumberInput("Credit Hours", "creditHours")}
                    {renderNumberInput("Lecture Hours", "lectureHours")}
                    {renderNumberInput("Practical Hours", "practicalHours")}
                  </div>
              </div>

              {/* FILE UPLOAD */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Documents</h3>
                <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-indigo-300 transition-colors bg-gray-50/30">
                    {mode === "edit" && form.fileUrl && (
                    <div className="mb-4 flex items-center gap-2 text-indigo-600 bg-indigo-50 w-fit px-3 py-1.5 rounded-lg text-sm font-medium">
                        <FileText size={16} />
                        <a href={form.fileUrl} target="_blank" rel="noreferrer" className="underline">
                        View Current PDF
                        </a>
                    </div>
                    )}

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {mode === "add" ? "Upload Syllabus PDF" : "Replace PDF (Optional)"} <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="file" 
                        name="syllabusFile" 
                        accept="application/pdf" 
                        onChange={handleChange} 
                        className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2.5 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100 transition-colors"
                    />
                    {errors.syllabusFile && <p className="text-xs text-red-600 mt-2 flex items-center gap-1"><AlertCircle size={10} /> {errors.syllabusFile}</p>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => navigate("/syllabus/all")}
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
                            {mode === "edit" ? "Update Syllabus" : "Add Syllabus"}
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

export default SyllabusForm;