import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApplyForAdmission } from "@/hooks/useAdmission";
import { useCourses } from "@/hooks/useCourses";
import { useColleges } from "@/hooks/useColleges";
import PageHeader from "@/components/common/PageHeader";
import { GraduationCap, Save, X } from "lucide-react";
import { toast } from "react-hot-toast";

const AdmissionForm = ({ mode = "add" }) => {
  const navigate = useNavigate();
  const applyMutation = useApplyForAdmission();

  const [formData, setFormData] = useState({
    courseId: "",
    collegeId: "",
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    previousEducation: "",
    reasonForApplication: "",
    referredBy: "",
  });

  const [errors, setErrors] = useState({});

  // Fetch courses and colleges
  const { data: coursesData } = useCourses({ page: 0, size: 1000 });
  const { data: collegesData } = useColleges({ page: 0, size: 1000 });

  const courses = coursesData?.content || [];
  const colleges = collegesData?.content || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.courseId) newErrors.courseId = "Course is required";
    if (!formData.collegeId) newErrors.collegeId = "College is required";
    if (!formData.applicantName || formData.applicantName.length < 2) {
      newErrors.applicantName = "Name must be at least 2 characters";
    }
    if (!formData.applicantEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.applicantEmail)) {
      newErrors.applicantEmail = "Valid email is required";
    }
    if (!formData.applicantPhone || !/^[6-9]\d{9}$/.test(formData.applicantPhone)) {
      newErrors.applicantPhone = "Valid 10-digit phone number required (starting with 6-9)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const payload = {
        courseId: parseInt(formData.courseId),
        collegeId: parseInt(formData.collegeId),
        applicantName: formData.applicantName,
        applicantEmail: formData.applicantEmail,
        applicantPhone: formData.applicantPhone,
        previousEducation: formData.previousEducation || undefined,
        reasonForApplication: formData.reasonForApplication || undefined,
        referredBy: formData.referredBy || undefined,
      };

      await applyMutation.mutateAsync(payload);
      toast.success("Admission application submitted successfully");
      setTimeout(() => navigate("/admin/admission"), 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to submit application";
      toast.error(errorMsg);

      // Handle field-specific errors
      if (err.response?.data?.data && typeof err.response.data.data === "object") {
        setErrors(err.response.data.data);
      }
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="New Admission Application"
        subtitle="Submit admission application for a course"
        breadcrumbs={[
          { label: "Admissions", to: "/admin/admission" },
          { label: "New Application" },
        ]}
        icon={GraduationCap}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course and College Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Course <span className="text-red-500">*</span>
              </label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                  errors.courseId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.courseName}
                  </option>
                ))}
              </select>
              {errors.courseId && <p className="mt-1 text-sm text-red-600">{errors.courseId}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                College <span className="text-red-500">*</span>
              </label>
              <select
                name="collegeId"
                value={formData.collegeId}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                  errors.collegeId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select College</option>
                {colleges.map((college) => (
                  <option key={college.collegeId} value={college.collegeId}>
                    {college.collegeName}
                  </option>
                ))}
              </select>
              {errors.collegeId && <p className="mt-1 text-sm text-red-600">{errors.collegeId}</p>}
            </div>
          </div>

          {/* Applicant Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Applicant Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="applicantName"
                value={formData.applicantName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                  errors.applicantName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter full name"
              />
              {errors.applicantName && (
                <p className="mt-1 text-sm text-red-600">{errors.applicantName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="applicantEmail"
                value={formData.applicantEmail}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                  errors.applicantEmail ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="email@example.com"
              />
              {errors.applicantEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.applicantEmail}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="applicantPhone"
                value={formData.applicantPhone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition ${
                  errors.applicantPhone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="9876543210"
                maxLength="10"
              />
              {errors.applicantPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.applicantPhone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Referred By
              </label>
              <input
                type="text"
                name="referredBy"
                value={formData.referredBy}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Name of referrer (optional)"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Previous Education
            </label>
            <textarea
              name="previousEducation"
              value={formData.previousEducation}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="e.g., +2 Science with 85% from ABC College, Kathmandu"
              maxLength="2000"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason for Application
            </label>
            <textarea
              name="reasonForApplication"
              value={formData.reasonForApplication}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Why do you want to apply for this course?"
              maxLength="500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/admin/admission")}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
              disabled={applyMutation.isLoading}
            >
              <X size={18} />
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50"
              disabled={applyMutation.isLoading}
            >
              <Save size={18} />
              {applyMutation.isLoading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmissionForm;
