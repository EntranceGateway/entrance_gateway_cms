// src/CourseForm.jsx
import React, { useState } from "react";

const CourseForm = () => {
  const [form, setForm] = useState({
    courseName: "",
    description: "",
    collegeId: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", form);
    alert(`Course Created: ${form.courseName}`);
    // You can send form to API here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-2xl rounded-xl max-w-lg w-full p-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Add New Course</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Course Name</label>
            <input
              type="text"
              name="courseName"
              value={form.courseName}
              onChange={handleChange}
              required
              placeholder="Software Engineering"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="An introduction to software engineering principles..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium">College ID</label>
            <input
              type="text"
              name="collegeId"
              value={form.collegeId}
              onChange={handleChange}
              required
              placeholder="4d9461cf-8103-444d-bdc7-849b0072113f"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-linear-to-r from-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-600 text-white py-3 rounded-lg font-semibold transition-all"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
