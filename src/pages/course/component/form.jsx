// src/components/CourseForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import { BookOpen, AlertCircle, Save, ArrowLeft } from "lucide-react";

const defaultForm = {
  courseName: "",
  description: "",
  collegeId: "",
  affiliation: "",
  courseType: "SEMESTER",
  courseLevel: "PLUS_TWO",
  criteria: "",
};

const CourseForm = ({ mode = "add", initialData = {}, onSubmit }) => {
  const navigate = useNavigate();
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
        collegeId: initialData.collegeId || "",
        affiliation: initialData.affiliation || "",
        courseType: initialData.courseType || "SEMESTER",
        courseLevel: initialData.courseLevel || "PLUS_TWO",
        criteria: initialData.criteria || "",
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

    if (!form.courseType) newErrors.courseType = "Course type is required.";
    if (!form.courseLevel) newErrors.courseLevel = "Course level is required.";
    if (!form.criteria.trim()) newErrors.criteria = "Criteria is required.";
    if (!form.affiliation) newErrors.affiliation = "Affiliation is required.";
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

      // Redirect to courses list after success
      setTimeout(() => {
        navigate("/course/all");
      }, 1500);
    } catch (err) {

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
    "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition shadow-sm bg-white";
  const labelBase = "block text-gray-700 mb-1.5 font-semibold text-sm";
  const errorText = "text-red-600 text-xs mt-1 block font-medium flex items-center gap-1";
  const errorBorder = "border-red-300 focus:border-red-500 focus:ring-red-200";
  const normalBorder = "border-gray-300 focus:border-indigo-500 focus:ring-indigo-100";

  return (
    <div className="w-full">
      <PageHeader
        title={mode === "edit" ? "Edit Course" : "Create New Course"}
        subtitle={mode === "edit" ? "Update course details and specifications" : "Add a new course to the system"}
        breadcrumbs={[
            { label: "Courses", to: "/course/all" },
            { label: mode === "edit" ? "Edit Course" : "New Course" }
        ]}
        icon={BookOpen}
      />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8">
            {message && (
              <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
                message.toLowerCase().includes("success")
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-indigo-50 border-indigo-200 text-indigo-700"
              }`}>
                <div className={`p-1.5 rounded-full ${message.toLowerCase().includes("success") ? "bg-green-100" : "bg-indigo-100"}`}>
                   <Save size={16} />
                </div>
                <p className="font-semibold">{message}</p>
              </div>
            )}

            {globalError && !Object.values(errors).length && (
               <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 flex items-center gap-3">
                 <AlertCircle size={20} />
                 <span className="font-semibold">{globalError}</span>
               </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Course Name */}
                  <div className="md:col-span-2">
                    <label htmlFor="courseName" className={labelBase}>
                      Course Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="courseName"
                      type="text"
                      name="courseName"
                      value={form.courseName}
                      onChange={handleChange}
                      placeholder="e.g. Bachelor in Computer Application"
                      className={`${inputBase} ${
                        fieldError("courseName") ? errorBorder : normalBorder
                      }`}
                    />
                    {fieldError("courseName") && (
                      <span className={errorText}><AlertCircle size={12} /> {fieldError("courseName")}</span>
                    )}
                  </div>

                  {/* Affiliation */}
                  <div>
                    <label htmlFor="affiliation" className={labelBase}>
                      Affiliation <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="affiliation"
                      name="affiliation"
                      value={form.affiliation}
                      onChange={handleChange}
                      className={`${inputBase} ${
                        fieldError("affiliation") ? errorBorder : normalBorder
                      }`}
                    >
                      <option value="">-- Select University --</option>
                      <option value="NEB">NEB (National Examination Board)</option>
                      <option value="TRIBHUVAN_UNIVERSITY">Tribhuvan University</option>
                      <option value="KATHMANDU_UNIVERSITY">Kathmandu University</option>
                      <option value="POKHARA_UNIVERSITY">Pokhara University</option>
                      <option value="LUMBINI_UNIVERSITY">Lumbini University</option>
                      <option value="PURWANCHAL_UNIVERSITY">
                        Purwanchal University
                      </option>
                      <option value="MID_WESTERN_UNIVERSITY">
                        Mid Western University
                      </option>
                      <option value="FAR_WESTERN_UNIVERSITY">
                        Far Western University
                      </option>
                      <option value="CAMPUS_AFFILIATED_TO_FOREIGN_UNIVERSITY">
                        Foreign University
                      </option>
                    </select>
                    {fieldError("affiliation") && (
                      <span className={errorText}><AlertCircle size={12} /> {fieldError("affiliation")}</span>
                    )}
                  </div>

                  {/* Course Type */}
                  <div>
                    <label htmlFor="courseType" className={labelBase}>
                      Course Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="courseType"
                      name="courseType"
                      value={form.courseType}
                      onChange={handleChange}
                      className={`${inputBase} ${
                        fieldError("courseType") ? errorBorder : normalBorder
                      }`}
                    >
                      <option value="">-- Select Course Type --</option>
                      <option value="SEMESTER">Semester</option>
                      <option value="ANNUAL">Annual</option>
                    </select>
                    {fieldError("courseType") && (
                      <span className={errorText}><AlertCircle size={12} /> {fieldError("courseType")}</span>
                    )}
                  </div>

                  {/* Course Level */}
                  <div>
                    <label htmlFor="courseLevel" className={labelBase}>
                      Course Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="courseLevel"
                      name="courseLevel"
                      value={form.courseLevel}
                      onChange={handleChange}
                      className={`${inputBase} ${
                        fieldError("courseLevel") ? errorBorder : normalBorder
                      }`}
                    >
                      <option value="">-- Select Course Level --</option>
                      <option value="PLUS_TWO">Plus Two</option>
                      <option value="BACHELOR">Bachelor</option>
                      <option value="MASTER">Master</option>
                      <option value="PHD">PhD</option>
                      <option value="DIPLOMA">Diploma</option>
                      <option value="M_PHIL">M.Phil</option>
                    </select>
                    {fieldError("courseLevel") && (
                      <span className={errorText}><AlertCircle size={12} /> {fieldError("courseLevel")}</span>
                    )}
                  </div>

                  {/* Criteria */}
                  <div>
                    <label htmlFor="criteria" className={labelBase}>
                      Criteria <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="criteria"
                      type="text"
                      name="criteria"
                      value={form.criteria}
                      onChange={handleChange}
                      placeholder="e.g. Minimum C+ in +2 Science"
                      className={`${inputBase} ${
                        fieldError("criteria") ? errorBorder : normalBorder
                      }`}
                    />
                    {fieldError("criteria") && (
                      <span className={errorText}><AlertCircle size={12} /> {fieldError("criteria")}</span>
                    )}
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label htmlFor="description" className={labelBase}>
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Write a brief description about this course..."
                      rows={5}
                      className={`${inputBase} ${
                        fieldError("description") ? errorBorder : normalBorder
                      }`}
                    />
                    {fieldError("description") && (
                      <span className={errorText}><AlertCircle size={12} /> {fieldError("description")}</span>
                    )}
                  </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-4 border-t border-gray-100 mt-6">
                 <button
                    type="button"
                    onClick={() => navigate("/course/all")}
                    className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold transition-colors"
                 >
                    Cancel
                 </button>
                 <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
                  >
                    {loading ? (
                        <>Processing...</>
                    ) : (
                        <>
                            <Save size={18} />
                            {mode === "edit" ? "Update Course" : "Create Course"}
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

export default CourseForm;

