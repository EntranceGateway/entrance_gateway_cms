import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../../Verification/Pagination";
import UniversalFilter from "../../../Verification/UniversalFilter";
import { deleteCourse, getCourses } from "../../../http/course";
const CourseTable = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const token = localStorage.getItem("token");

  // Fetch Courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await getCourses({}, token);
      const data = res.data.data.content || [];
      setAllCourses(data);
      setFilteredCourses(data);
    } catch (err) {
      console.error("Fetch Course Error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Live Filtering logic
  const handleFilter = (filters) => {
    let data = [...allCourses];

    if (filters.courseName)
      data = data.filter((c) =>
        c.courseName.toLowerCase().includes(filters.courseName.toLowerCase())
      );

    if (filters.description)
      data = data.filter((c) =>
        c.description.toLowerCase().includes(filters.description.toLowerCase())
      );

    if (filters.collegeId)
      data = data.filter((c) =>
        c.collegeId.toLowerCase().includes(filters.collegeId.toLowerCase())
      );

    setFilteredCourses(data);
    setPage(1);
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

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / PAGE_SIZE);
  const paginatedCourses = filteredCourses.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Courses</h1>

      {/* Filters */}
      <UniversalFilter
        config={[
          { name: "courseName", label: "Course Name", type: "text", placeholder: "Search by course name" },
          { name: "description", label: "Description", type: "text", placeholder: "Search by description" },
          { name: "collegeName", label: "College Name", type: "text", placeholder: "Search by college Name" },
        ]}
        onFilter={handleFilter}
      />

      {/* Table */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Course Name", "CollegeName","Description", "College ID", "Action"].map((col) => (
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
                  <td colSpan={4} className="text-center p-6 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : paginatedCourses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-6 text-gray-500">
                    🔍 No courses found
                  </td>
                </tr>
              ) : (
                paginatedCourses.map((course) => (
                  <tr key={course.courseId} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-800">{course.courseName}</td>
                    <td className="p-4 font-medium text-gray-800">{course.collegeName}</td>
                    <td className="p-4 text-gray-600">{course.description}</td>
                    <td className="p-4 text-gray-600">{course.collegeId}</td>

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
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default CourseTable;
