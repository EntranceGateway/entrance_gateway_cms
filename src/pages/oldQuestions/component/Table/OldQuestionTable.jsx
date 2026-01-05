import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../../../Verification/Pagination";
import { getOldQuestions, filterOldQuestions, deleteOldQuestion, getOldQuestionPdfUrl } from "../../../../http/oldQuestionCollection";
import { getCourses } from "../../../../http/course";

const PAGE_SIZE = 10;

// Affiliation options
const AFFILIATIONS = [
  { value: "TRIBHUVAN_UNIVERSITY", label: "Tribhuvan University" },
  { value: "POKHARA_UNIVERSITY", label: "Pokhara University" },
  { value: "KATHMANDU_UNIVERSITY", label: "Kathmandu University" },
  { value: "PURWANCHAL_UNIVERSITY", label: "Purwanchal University" },
  { value: "MID_WESTERN_UNIVERSITY", label: "Mid Western University" },
  { value: "FAR_WESTERN_UNIVERSITY", label: "Far Western University" },
  { value: "LUMBINI_UNIVERSITY", label: "Lumbini University" },
  { value: "CAMPUS_AFFILIATED_TO_FOREIGN_UNIVERSITY", label: "Foreign University" },
];

const OldQuestionTable = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter states
  const [affiliation, setAffiliation] = useState("");
  const [courseId, setCourseId] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [setName, setSetName] = useState("");

  // Course dropdown data
  const [courses, setCourses] = useState([]);

  const token = localStorage.getItem("token");

  // All courses (fetched once)
  const [allCourses, setAllCourses] = useState([]);

  // Fetch all courses on mount
  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const res = await getCourses({ size: 100 }, token);
        const data = res.data.data?.content || res.data.data || [];
        setAllCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching all courses:", err);
        setAllCourses([]);
      }
    };
    fetchAllCourses();
  }, [token]);

  // Filter courses when affiliation changes
  useEffect(() => {
    if (!affiliation) {
      setCourses([]);
      return;
    }
    const filtered = allCourses.filter(
      (c) => c.affiliation === affiliation
    );
    setCourses(filtered);
  }, [affiliation, allCourses]);

  // Fetch old questions
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: PAGE_SIZE,
        ...(sortField && { sortBy: sortField, sortDir: sortOrder }),
      };

      let res;

      // Use filter endpoint if courseId is provided
      if (courseId) {
        res = await filterOldQuestions(
          {
            ...params,
            courseId,
            ...(semester && { semester: parseInt(semester) }),
            ...(year && { year: parseInt(year) }),
          },
          token
        );
      } else {
        // Use questions endpoint with optional filters
        res = await getOldQuestions(
          {
            ...params,
            ...(year && { year: parseInt(year) }),
            ...(setName && { setName }),
          },
          token
        );
      }

      // API Response format: { message, data: { content, totalElements, totalPages, pageNumber, pageSize, last } }
      const responseData = res.data.data || res.data;
      const data = responseData.content || [];
      setQuestions(data);
      setTotalPages(responseData.totalPages || 0);
    } catch (err) {
      console.error("Fetch old questions error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortField, sortOrder, affiliation, courseId, semester, year, setName]);

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this old question?")) return;

    try {
      await deleteOldQuestion(id, token);
      fetchQuestions();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Handle filter changes and reset to first page
  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setPage(0);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage - 1);
  };

  // Clear all filters
  const clearFilters = () => {
    setAffiliation("");
    setCourseId("");
    setSemester("");
    setYear("");
    setSetName("");
    setPage(0);
  };

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Old Question Collection</h1>
        <Link
          to="/old-questions/add"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          + Add Question
        </Link>
      </div>

      {/* Filter Controls */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-4 space-y-4">
        <h3 className="font-semibold text-gray-700">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Affiliation Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Affiliation</label>
            <select
              value={affiliation}
              onChange={(e) => {
                setAffiliation(e.target.value);
                setCourseId("");
                setSemester("");
                setPage(0);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Affiliations</option>
              {AFFILIATIONS.map((aff) => (
                <option key={aff.value} value={aff.value}>
                  {aff.label}
                </option>
              ))}
            </select>
          </div>

          {/* Course Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
            <select
              value={courseId}
              onChange={(e) => {
                setCourseId(e.target.value);
                setSemester("");
                setPage(0);
              }}
              disabled={!affiliation}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">
                {!affiliation ? "Select affiliation first" : "All Courses"}
              </option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <input
              type="number"
              value={semester}
              onChange={(e) => handleFilterChange(setSemester)(e.target.value)}
              placeholder="e.g., 1, 2, 3"
              min="1"
              max="8"
              disabled={!courseId}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => handleFilterChange(setYear)(e.target.value)}
              placeholder="e.g., 2024"
              min="1990"
              max="2100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Set Name Filter (only when no courseId) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Set Name</label>
            <input
              type="text"
              value={setName}
              onChange={(e) => handleFilterChange(setSetName)(e.target.value)}
              placeholder="Search by set name"
              disabled={!!courseId}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {(affiliation || courseId || semester || year || setName) && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition"
          >
            Clear Filters
          </button>
        )}
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
        >
          <option value="">Default</option>
          <option value="setName">Set Name</option>
          <option value="year">Year</option>
          <option value="subject">Subject</option>
          <option value="courseName">Course Name</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setPage(0);
          }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Table */}
      <div className="mt-4 bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Set Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                    No old questions found
                  </td>
                </tr>
              ) : (
                questions.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{q.setName}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {q.subject || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        {q.courseName || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                      {q.year}
                    </td>
                    <td className="px-4 py-4 max-w-xs truncate text-gray-600">
                      {q.description || "-"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-2">
                        <a
                          href={getOldQuestionPdfUrl(q.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          View PDF
                        </a>
                        <Link
                          to={`/old-questions/edit/${q.id}`}
                          className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200">
          <Pagination
            currentPage={page + 1}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default OldQuestionTable;
