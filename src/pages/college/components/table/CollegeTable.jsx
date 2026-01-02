import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteColleges, getColleges } from "../../../../http/colleges";
import UniversalFilter from "../../../../Verification/UniversalFilter";
import Pagination from "../../../../Verification/Pagination";
import { BookOpen, Plus } from "lucide-react";

const CollegeTable = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0); // API uses 0-based indexing
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 10;

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter states
  const [filters, setFilters] = useState({});

  const token = localStorage.getItem("token");

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: PAGE_SIZE,
        ...(sortField && { sortBy: sortField, sortDir: sortOrder }),
        ...filters,
      };
      
      const res = await getColleges(params, token);
      const data = res.data.data.content || [];
      setColleges(data);
      setTotalPages(res.data.data.page?.totalPages || 0);
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchColleges();
  }, [page, sortField, sortOrder, filters]);

  // Update filters and reset to first page
  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setPage(0); // reset to first page
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this college?")) return;

    try {
      await deleteColleges(id, token);
      fetchColleges();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Handle page change (convert from 1-based display to 0-based API)
  const handlePageChange = (newPage) => {
    setPage(newPage - 1);
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Colleges</h1>

      {/* Live filter */}
      <UniversalFilter
        config={[
          { name: "collegeName", label: "College Name", type: "text", placeholder: "Search by name" },
          { name: "location", label: "Location", type: "text", placeholder: "Search location" },
          {
            name: "collegeType",
            label: "Type",
            type: "select",
            options: [
              { value: "PRIVATE", label: "Private" },
              { value: "COMMUNITY", label: "Community" },
              { value: "GOVERNMENT", label: "Government" },
            ],
          },
          {
            name: "priority",
            label: "Priority",
            type: "select",
            options: [
              { value: "HIGH", label: "High" },
              { value: "MEDIUM", label: "Medium" },
              { value: "LOW", label: "Low" },
            ],
          },
        ]}
        onFilter={handleFilter} // live filter on every input
      />

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
        >
          <option value="">None</option>
          <option value="collegeName">Name</option>
          <option value="location">Location</option>
          <option value="priority">Priority</option>
          <option value="establishedYear">Year</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setPage(0);
          }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!sortField}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Name", "Location", "Affiliation", "Priority", "Courses", "Contact", "Email", "Website", "Year", "Action"].map(
                  (col) => (
                    <th
                      key={col}
                      className="p-4 text-left font-medium text-gray-700 sticky top-0 bg-gray-50 z-10"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center p-6 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : colleges.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center p-6 text-gray-500">
                    🔍 No colleges found for selected filters
                  </td>
                </tr>
              ) : (
                colleges.map((college) => (
                  <tr key={college.collegeId} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-800">{college.collegeName}</td>
                    <td className="p-4 text-gray-600">{college.location}</td>
                    <td className="p-4 text-gray-600">{college.affiliation?.replace(/_/g, " ")}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-md font-semibold ${
                          college.priority === "HIGH"
                            ? "bg-red-100 text-red-700"
                            : college.priority === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {college.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                          <BookOpen className="w-3 h-3" />
                          {college.courses?.length || 0}
                        </span>
                        {college.courses?.length > 0 && (
                          <div className="relative group">
                            <span className="cursor-help text-gray-400 hover:text-gray-600">ℹ️</span>
                            <div className="absolute z-20 hidden group-hover:block left-0 top-6 w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
                              <p className="text-xs font-semibold text-gray-700 mb-2">Courses:</p>
                              <ul className="text-xs text-gray-600 space-y-1">
                                {college.courses.slice(0, 5).map((c) => (
                                  <li key={c.courseId} className="truncate">• {c.courseName}</li>
                                ))}
                                {college.courses.length > 5 && (
                                  <li className="text-blue-600">+{college.courses.length - 5} more</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{college.contact}</td>
                    <td className="p-4 text-gray-600">{college.email}</td>
                    <td className="p-4 text-blue-600 underline">
                      <a href={college.website} target="_blank" rel="noreferrer">
                        Visit
                      </a>
                    </td>
                    <td className="p-4 text-gray-600">{college.establishedYear}</td>
                    <td className="p-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                      <Link
                        to={`/college/${college.collegeId}/courses`}
                        className="px-3 py-1.5 rounded-xl text-green-700 font-semibold border border-green-200 hover:bg-green-50 transition flex items-center gap-1"
                        title="Manage Courses"
                      >
                        <Plus className="w-4 h-4" />
                        Courses
                      </Link>
                      <Link
                        to={`/college/edit/${college.collegeId}`}
                        className="px-3 py-1.5 rounded-xl text-blue-700 font-semibold border border-blue-200 hover:bg-blue-50 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(college.collegeId)}
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
      <Pagination
        page={page + 1}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CollegeTable;
