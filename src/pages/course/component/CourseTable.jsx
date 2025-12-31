import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../../Verification/Pagination";
import { deleteCourse, getCourses, getCoursesByAffiliation } from "../../../http/course";

const CourseTable = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0); // API uses 0-based indexing
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 10;

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter state
  const [affiliation, setAffiliation] = useState("");

  const token = localStorage.getItem("token");

  // Fetch Courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      let res;
      
      if (affiliation) {
        // Use affiliation-specific endpoint
        res = await getCoursesByAffiliation(
          { affiliation, page, size: PAGE_SIZE },
          token
        );
      } else {
        // Use default endpoint with sorting
        const params = {
          page,
          size: PAGE_SIZE,
          ...(sortField && { sortBy: sortField, sortDir: sortOrder }),
        };
        res = await getCourses(params, token);
      }
      
      const data = res.data.data.content || [];
      setCourses(data);
      setTotalPages(res.data.data.page?.totalPages || 0);
    } catch (err) {
      console.error("Fetch Course Error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortField, sortOrder, affiliation]);

  // Handle affiliation filter change
  const handleAffiliationChange = (value) => {
    setAffiliation(value);
    setPage(0); // reset to first page
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await deleteCourse(id, token);
      fetchCourses();
    } catch (err) {
      console.error("Delete Course Error:", err);
    }
  };

  // Handle page change (convert from 1-based display to 0-based API)
  const handlePageChange = (newPage) => {
    setPage(newPage - 1);
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Courses</h1>

      {/* Filter Controls */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-4 space-y-4">
        <h3 className="font-semibold text-gray-700">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Affiliation Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Affiliation</label>
            <select
              value={affiliation}
              onChange={(e) => handleAffiliationChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="TRIBHUVAN_UNIVERSITY">Tribhuvan University</option>
              <option value="POKHARA_UNIVERSITY">Pokhara University</option>
              <option value="KATHMANDU_UNIVERSITY">Kathmandu University</option>
              <option value="PURWANCHAL_UNIVERSITY">Purwanchal University</option>
              <option value="MID_WESTERN_UNIVERSITY">Mid Western University</option>
              <option value="FAR_WESTERN_UNIVERSITY">Far Western University</option>
              <option value="LUMBINI_UNIVERSITY">Lumbini University</option>
              <option value="CAMPUS_AFFILIATED_TO_FOREIGN_UNIVERSITY">Campus Affiliated to Foreign University</option>
            </select>
          </div>

          {/* Clear Filter */}
          {affiliation && (
            <div className="flex items-end">
              <button
                onClick={() => handleAffiliationChange("")}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sort Controls */}
      <div className="bg-white shadow-md rounded-lg p-4 mt-4 flex flex-wrap gap-4 items-center">
        <span className="font-medium text-gray-700">Sort By:</span>
        <select
          value={sortField}
          onChange={(e) => {
            setSortField(e.target.value);
            setPage(0);
          }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!!affiliation}
        >
          <option value="">Default (courseName)</option>
          <option value="courseName">Course Name</option>
          <option value="description">Description</option>
          <option value="courseLevel">Course Level</option>
          <option value="courseType">Course Type</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setPage(0);
          }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!sortField || !!affiliation}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        {affiliation && (
          <span className="text-xs text-gray-500 italic">Sorting disabled when filtering by affiliation</span>
        )}
      </div>

      {/* Table */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Course Name", "Description", "Course Level", "Course Type", "Affiliation", "Action"].map((col) => (
                  <th
                    key={col}
                    className="p-4 text-left font-medium text-gray-700 sticky top-0 bg-gray-50 z-10"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center p-6 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-6 text-gray-500">
                    🔍 No courses found
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.courseId} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-800">{course.courseName}</td>
                    <td className="p-4 text-gray-600 max-w-xs truncate" title={course.description}>{course.description}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs font-semibold rounded-md bg-purple-100 text-purple-700">
                        {course.courseLevel?.replace(/_/g, ' ') || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs font-semibold rounded-md bg-green-100 text-green-700">
                        {course.courseType?.replace(/_/g, ' ') || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs font-semibold rounded-md bg-blue-100 text-blue-700">
                        {course.affiliation?.replace(/_/g, ' ') || 'N/A'}
                      </span>
                    </td>

                    <td className="p-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                         <Link
                        to={`/syllabus/add/${course.courseId}`}
                        className="px-3 py-1.5 rounded-xl text-blue-700 font-semibold border border-blue-200 hover:bg-blue-50 transition"
                      >
                        Add syllabus
                      </Link>
                      <Link
                        to={`/course/edit/${course.courseId}`}
                        className="px-3 py-1.5 rounded-xl text-amber-700 font-semibold border border-blue-200 hover:bg-blue-50 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(course.courseId)}
                        className="px-3 py-1.5 rounded-xl text-red-700 font-semibold border border-red-200 hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination page={page + 1} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default CourseTable;
