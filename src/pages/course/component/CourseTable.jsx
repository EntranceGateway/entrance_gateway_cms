import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../../Verification/Pagination";
import UniversalFilter from "../../../Verification/UniversalFilter";
import { getCourse } from "../../../http/course";

const LIMIT = 15;

const CourseTable = () => {
  const [courses, setCourses] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT, ...filters };
      const res = await getCourse(params); // fetch using API module
      
      setCourses(res.data.courses || []);
      setTotal(res.data.total || 0);
      console.log(res)
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, [page, filters]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-semibold mb-6 tracking-wide">Courses</h1>

      {/* Filter */}
      <UniversalFilter
        config={[
          { name: "courseName", label: "Course Name", type: "text", placeholder: "Search by title" },
          { name: "description", label: "Description", type: "text", placeholder: "Search description" },
        ]}
        onFilter={(newFilters) => {
          setPage(1);
          setFilters(newFilters);
        }}
      />

      {/* Table */}
      <div className="bg-white shadow-lg border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left font-medium text-gray-700">Title</th>
                <th className="p-4 text-left font-medium text-gray-700">Description</th>
                <th className="p-4 text-center font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center p-6 text-gray-400 italic">Loading...</td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center p-6 text-gray-400 italic">No courses found</td>
                </tr>
              ) : (
                courses.map((item) => (
                  <tr key={item.collegeId} className="hover:bg-gray-50 transition-all duration-200 cursor-pointer">
                    <td className="p-4 text-gray-800 font-medium">{item.courseName}</td>
                    <td className="p-4 text-gray-600">{item.description}</td>
                    <td className="p-4 flex items-center justify-center gap-3">
                      <Link
                        to={`/edit/${item.collegeId}`}
                        className="px-4 py-2 rounded-lg text-blue-700 font-semibold border border-blue-200 hover:bg-blue-50 shadow-sm transition transform hover:scale-105"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/delete/${item.collegeId}`}
                        className="px-4 py-2 rounded-lg text-red-700 font-semibold border border-red-200 hover:bg-red-50 shadow-sm transition transform hover:scale-105"
                      >
                        Delete
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default CourseTable;
