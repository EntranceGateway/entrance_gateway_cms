import React, { useState } from "react";
import { GraduationCap, Upload, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addSyllabus } from "../../../../http/syllabus";

const SyllabusForm = ({ mode = "add", initialData = null, token }) => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    courseId: "",
    syllabusTitle: "",
    courseCode: "",
    courseName: "",
    creditHours: "",
    lectureHours: "",
    practicalHours: "",
    semester: "",
    year: "",
    syllabusFile: null,
  });

  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Handle Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // Handle File
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setData({ ...data, syllabusFile: file });
    setFileName(file?.name || "");
  };

  // Validate
  const validateForm = () => {
    const newErrors = {};

    if (!data.courseId.trim()) newErrors.courseId = "Course ID is required";
    if (!data.syllabusTitle.trim()) newErrors.syllabusTitle = "Syllabus Title is required";
    if (!data.courseCode.trim()) newErrors.courseCode = "Course Code is required";
    if (!data.courseName.trim()) newErrors.courseName = "Course Name is required";
    if (!data.creditHours) newErrors.creditHours = "Credit Hours required";
    if (!data.lectureHours) newErrors.lectureHours = "Lecture Hours required";
    if (!data.semester) newErrors.semester = "Semester required";

    if (mode === "add" && !data.syllabusFile)
      newErrors.syllabusFile = "PDF required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const res = await addSyllabus(formData, token);

      if (res.status === 201) {
        navigate("/"); // redirect after success
      }

    } catch (err) {
      console.log(err)
      setSubmitError(err?.response?.data?.message || "Something went wrong");

    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3 mb-4">
          <GraduationCap className="text-blue-600" />
          {mode === "add" ? "Add Syllabus" : "Edit Syllabus"}
        </h1>

        {submitError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Course ID */}
          <div>
            <label className="block text-sm font-medium mb-1">Course ID *</label>
            <input
              type="text"
              name="courseId"
              value={data.courseId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter Course ID"
            />
            {errors.courseId && <span className="text-red-600 text-sm">{errors.courseId}</span>}
          </div>

          {/* Syllabus Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Syllabus Title *</label>
            <input
              name="syllabusTitle"
              value={data.syllabusTitle}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.syllabusTitle && <span className="text-red-600 text-sm">{errors.syllabusTitle}</span>}
          </div>

          {/* Course Code */}
          <div>
            <label className="block text-sm font-medium mb-1">Course Code *</label>
            <input
              name="courseCode"
              value={data.courseCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.courseCode && <span className="text-red-600 text-sm">{errors.courseCode}</span>}
          </div>

          {/* Course Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Course Name *</label>
            <input
              name="courseName"
              value={data.courseName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.courseName && <span className="text-red-600 text-sm">{errors.courseName}</span>}
          </div>

          {/* Credit Hours */}
          <div>
            <label className="block text-sm font-medium mb-1">Credit Hours *</label>
            <input
              type="number"
              name="creditHours"
              value={data.creditHours}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.creditHours && <span className="text-red-600 text-sm">{errors.creditHours}</span>}
          </div>

          {/* Lecture Hours */}
          <div>
            <label className="block text-sm font-medium mb-1">Lecture Hours *</label>
            <input
              type="number"
              name="lectureHours"
              value={data.lectureHours}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.lectureHours && <span className="text-red-600 text-sm">{errors.lectureHours}</span>}
          </div>

          {/* Practical Hours */}
          <div>
            <label className="block text-sm font-medium mb-1">Practical Hours</label>
            <input
              type="number"
              name="practicalHours"
              value={data.practicalHours}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm font-medium mb-1">Semester *</label>
            <input
              type="text"
              name="semester"
              value={data.semester}
              onChange={handleChange}
              placeholder="1-8"
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.semester && <span className="text-red-600 text-sm">{errors.semester}</span>}
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium mb-1">Year</label>
            <input
              type="number"
              name="year"
              value={data.year}
              onChange={handleChange}
              placeholder="2025"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* File */}
          <div>
            <label className="block text-sm font-medium mb-1">
              <Upload className="inline w-4 h-4 mr-1" /> Syllabus PDF {mode === "add" && "*"}
            </label>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            {fileName && <p className="text-sm text-gray-600 mt-1">Selected: {fileName}</p>}
            {errors.syllabusFile && <span className="text-red-600 text-sm">{errors.syllabusFile}</span>}
          </div>

          {/* Buttons */}
          <div className="pt-4 flex gap-3 justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : mode === "add" ? "Add Syllabus" : "Update Syllabus"}
            </button>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default SyllabusForm;
