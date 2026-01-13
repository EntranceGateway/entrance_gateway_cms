import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookOpen, Building2, Plus, X, Check, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/common/PageHeader";
import { FormSkeleton } from "@/components/loaders";
import { getSingle, addCourseToCollege } from "../../http/colleges";
import { getCourses } from "../../http/course";

const AddCourseToCollege = () => {
  const { id: collegeId } = useParams();
  const navigate = useNavigate();

  const [college, setCollege] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch college details
  const fetchCollege = async () => {
    try {
      const res = await getSingle(collegeId);
      if (res.status === 200) {
        setCollege(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch college:", err);
      setError("Failed to load college details");
    }
  };

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await getCourses({ page: 0, size: 100 });
      if (res.status === 200) {
        setAllCourses(res.data.data.content || []);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError("Failed to load courses");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCollege(), fetchCourses()]);
      setLoading(false);
    };
    loadData();
  }, [collegeId]);

  // Filter out already assigned courses
  const availableCourses = allCourses.filter((course) => {
    const assignedIds = (college?.courses || []).map((c) => c.courseId);
    return !assignedIds.includes(course.courseId);
  });

  const handleAddCourse = async () => {
    if (!selectedCourseId) {
      setError("Please select a course");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await addCourseToCollege(collegeId, selectedCourseId);
      if (res.status === 200) {
        setSuccess("Course added successfully!");
        setSelectedCourseId("");
        // Refresh college data
        await fetchCollege();
      }
    } catch (err) {
      console.error("Failed to add course:", err);
      setError(err.message || "Failed to add course to college");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <FormSkeleton />
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="Manage Courses"
        subtitle={`Add or view courses for ${college?.collegeName}`}
        breadcrumbs={[
            { label: "Colleges", to: "/college/all" },
            { label: "Manage Courses" },
        ]}
        icon={BookOpen}
        actions={[
            {
                label: "Back to Colleges",
                onClick: () => navigate("/college/all"),
                variant: "secondary"
            }
        ]}
      />
      
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        
          {/* College Info Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
             <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Building2 size={16} /> College Details
             </h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                    <span className="text-xs font-medium text-gray-500 block mb-1">Location</span>
                    <p className="font-semibold text-gray-900">{college?.location || "N/A"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                    <span className="text-xs font-medium text-gray-500 block mb-1">Affiliation</span>
                    <p className="font-semibold text-gray-900 text-sm">{college?.affiliation?.replace(/_/g, " ") || "N/A"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                    <span className="text-xs font-medium text-gray-500 block mb-1">Type</span>
                    <p className="font-semibold text-gray-900">{college?.collegeType || "N/A"}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                    <span className="text-xs font-medium text-gray-500 block mb-1">Priority</span>
                    <span
                        className={`inline-flex px-2.5 py-0.5 text-xs rounded-full font-bold uppercase tracking-wide
                           ${college?.priority === "HIGH"
                                ? "bg-red-100 text-red-700"
                                : college?.priority === "MEDIUM"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-emerald-100 text-emerald-700"
                        }`}
                    >
                        {college?.priority}
                    </span>
                </div>
             </div>
          </div>

          {/* Alerts */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg flex items-center gap-2 mb-4">
              <Check className="w-5 h-5" />
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-lg flex items-center gap-2 mb-4">
              <X className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Add Course Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <Plus className="w-5 h-5 text-green-600" />
              Add New Course
            </h2>

            <div className="flex flex-col md:flex-row gap-4">
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select a Course --</option>
                {availableCourses.map((course) => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.courseName} ({course.courseLevel} -{" "}
                    {course.courseType})
                  </option>
                ))}
              </select>

              <button
                onClick={handleAddCourse}
                disabled={submitting || !selectedCourseId}
                className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${submitting || !selectedCourseId
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Course
                  </>
                )}
              </button>
            </div>

            {availableCourses.length === 0 && (
              <p className="text-gray-500 text-sm mt-3">
                All available courses have been assigned to this college.
              </p>
            )}
          </div>

          {/* Currently Assigned Courses */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Assigned Courses ({college?.courses?.length || 0})
            </h2>

            {college?.courses?.length > 0 ? (
              <div className="grid gap-3">
                {college.courses.map((course) => (
                  <div
                    key={course.courseId}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {course.courseName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {course.courseLevel} • {course.courseType} •{" "}
                          {course.affiliation?.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                        Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No courses assigned yet.</p>
                <p className="text-sm">
                  Use the form above to add courses to this college.
                </p>
              </div>
            )}
          </div>

          {/* Back Button */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate("/college/all")}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Back to Colleges
            </button>
            <button
              onClick={() => navigate(`/college/edit/${collegeId}`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Edit College Details
            </button>
          </div>
      </div>
    </Layout>
  );
};

export default AddCourseToCollege;
