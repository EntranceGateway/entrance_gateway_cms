import React, { useState, useEffect } from "react";

const CourseForm = ({ mode = "add", initialData = {}, onSubmit }) => {
  const [form, setForm] = useState({
    courseName: "",
    description: "",
    collegeId: "",
    courseType: "SEMESTER",
    courseLevel: "PLUS_TWO",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Prefill form in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        courseName: initialData.courseName || "",
        description: initialData.description || "",
        collegeId: initialData.collegeId || "",
        courseType: initialData.courseType || "SEMESTER",
        courseLevel: initialData.courseLevel || "PLUS_TWO",
      });
    }
  }, [initialData, mode]);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear field-specific error
    setMessage(""); // clear general message
  };

  // Frontend validation
  const validate = () => {
    const newErrors = {};
    if (!form.courseName.trim()) newErrors.courseName = "Course name is required";
    else if (form.courseName.length < 3)
      newErrors.courseName = "Course name must be at least 3 characters";

    if (!form.description.trim()) newErrors.description = "Description is required";
    else if (form.description.length < 10)
      newErrors.description = "Description must be at least 10 characters";

    if (!form.collegeId.trim()) newErrors.collegeId = "College ID is required";
    else if (!/^[0-9a-fA-F-]{36}$/.test(form.collegeId))
      newErrors.collegeId = "College ID must be a valid UUID";

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const frontendErrors = validate();
    if (Object.keys(frontendErrors).length > 0) {
      setErrors(frontendErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(form); // call parent handler (API)
      setMessage(
        mode === "edit"
          ? "Course updated successfully!"
          : "Course created successfully!"
      );
      if (mode === "add") {
        setForm({
          courseName: "",
          description: "",
          collegeId: "",
          courseType: "SEMESTER",
          courseLevel: "PLUS_TWO",
        });
      }
    } catch (err) {
      // Backend errors assumed in { fieldName: "error message" } format
      if (err && typeof err === "object") setErrors(err);
      else setMessage("Error: Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-2xl rounded-xl max-w-lg w-full p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {mode === "edit" ? "Edit Course" : "Add New Course"}
        </h1>

        {message && (
          <p
            className={`text-center mb-4 font-medium ${
              message.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Name */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Course Name</label>
            <input
              type="text"
              name="courseName"
              value={form.courseName}
              onChange={handleChange}
              placeholder="Software Engineering"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            {errors.courseName && (
              <span className="text-red-600 text-sm mt-1 block">{errors.courseName}</span>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Write course description..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            {errors.description && (
              <span className="text-red-600 text-sm mt-1 block">{errors.description}</span>
            )}
          </div>

          {/* College ID */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">College ID</label>
            <input
              type="text"
              name="collegeId"
              value={form.collegeId}
              onChange={handleChange}
              placeholder="UUID of college"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            {errors.collegeId && (
              <span className="text-red-600 text-sm mt-1 block">{errors.collegeId}</span>
            )}
          </div>

          {/* Course Type */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Course Type</label>
            <select
              name="courseType"
              value={form.courseType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="SEMESTER">Semester</option>
              <option value="ANNUAL">Annual</option>
            </select>
          </div>

          {/* Course Level */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Course Level</label>
            <select
              name="courseLevel"
              value={form.courseLevel}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="PLUS_TWO">Plus Two</option>
              <option value="BACHELOR">Bachelor</option>
              <option value="MASTER">Master</option>
              <option value="PHD">PhD</option>
              <option value="DIPLOMA">Diploma</option>
              <option value="M_PHIL">M.Phil</option>
            </select>
          </div>

          {/* Submit Button */}
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
