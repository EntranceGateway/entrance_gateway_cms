import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../../../Verification/Pagination";
import { deleteSyllabus, getSyllabus, getSyllabusByAffiliationAndCourse, getSyllabusByAffiliationCourseAndSemester } from "../../../../http/syllabus";

const PAGE_SIZE = 5;

const SyllabusTable = () => {
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0); // API uses 0-based indexing
  const [totalPages, setTotalPages] = useState(0);

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter states
  const [affiliation, setAffiliation] = useState("");
  const [courseName, setCourseName] = useState("");
  const [semester, setSemester] = useState("");



  // ---------------- FETCH DATA ----------------
  const fetchSyllabus = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: PAGE_SIZE,
        ...(sortField && { sortBy: sortField, sortDir: sortOrder }),
      };

      let res;

      console.log("Fetching syllabus with filters:", {
        affiliation,
        courseName,
        semester,
        affiliationLength: affiliation?.length,
        courseNameLength: courseName?.length,
        semesterValue: semester
      });

      // Choose endpoint based on filters (trim to remove spaces)
      const trimmedAffiliation = affiliation?.trim();
      const trimmedCourseName = courseName?.trim();
      const trimmedSemester = semester?.trim();

      if (trimmedAffiliation && trimmedCourseName && trimmedSemester) {
        // Use semester-specific endpoint
        console.log("Using semester endpoint with:", { trimmedAffiliation, trimmedCourseName, trimmedSemester });
        res = await getSyllabusByAffiliationCourseAndSemester(
          { ...params, affiliation: trimmedAffiliation, courseName: trimmedCourseName, semester: parseInt(trimmedSemester) }
        );
      } else if (trimmedAffiliation && trimmedCourseName) {
        // Use course-specific endpoint
        console.log("Using course endpoint with:", { trimmedAffiliation, trimmedCourseName });
        res = await getSyllabusByAffiliationAndCourse(
          { ...params, affiliation: trimmedAffiliation, courseName: trimmedCourseName }
        );
      } else {
        // Use default endpoint (all syllabus)
        console.log("Using default endpoint - no filters or incomplete filters");
        res = await getSyllabus(params);
      }

      console.log("Response:", res.data);
      // API Response format: { message, data: { content, totalElements, totalPages, pageNumber, pageSize, last } }
      const responseData = res.data.data || res.data;
      const data = responseData.content || [];
      setSyllabus(data);
      setTotalPages(responseData.totalPages || 0);
      console.log("Total pages:", responseData.totalPages);
    } catch (err) {
      console.error("Fetch syllabus error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSyllabus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortField, sortOrder, affiliation, courseName, semester]);

  // ---------------- DELETE HANDLER ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this syllabus?")) return;

    try {
      await deleteSyllabus(id);
      fetchSyllabus();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Handle filter changes and reset to first page
  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setPage(0);
  };

  // Handle page change (convert from 1-based display to 0-based API)
  const handlePageChange = (newPage) => {
    setPage(newPage - 1);
  };

  // ---------------- RENDER ----------------
  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Syllabus List</h1>

      {/* -------- FILTER CONTROLS -------- */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-4 space-y-4">
        <h3 className="font-semibold text-gray-700">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Affiliation Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Affiliation</label>
            <select
              value={affiliation}
              onChange={(e) => handleFilterChange(setAffiliation)(e.target.value)}
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

          {/* Course Name Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => handleFilterChange(setCourseName)(e.target.value)}
              placeholder="e.g., CSIT, BCA"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Semester Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester (Optional)</label>
            <input
              type="number"
              value={semester}
              onChange={(e) => handleFilterChange(setSemester)(e.target.value)}
              placeholder="e.g., 1, 2, 3"
              min="1"
              max="8"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        {(affiliation || courseName || semester) && (
          <button
            onClick={() => {
              setAffiliation("");
              setCourseName("");
              setSemester("");
              setPage(0);
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* -------- SORT CONTROLS -------- */}
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
          <option value="">Default (syllabusTitle)</option>
          <option value="syllabusTitle">Title</option>
          <option value="courseName">Course Name</option>
          <option value="semester">Semester</option>
          <option value="year">Year</option>
          <option value="courseCode">Course Code</option>
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

      {/* -------- TABLE -------- */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {[
                  "Syllabus Title",
                  "Subject Name",
                  "Course",
                  "Course Code",
                  "Semester",
                  "Year",
                  "Credit Hrs",
                  "Lecture Hrs",
                  "Practical Hrs",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    className="p-4 text-left font-medium text-gray-700 sticky top-0 bg-gray-50"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={10} className="p-6 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : syllabus.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-6 text-center text-gray-500">
                    No syllabus found
                  </td>
                </tr>
              ) : (
                syllabus.map((item) => (
                  <tr
                    key={item.syllabusId}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium text-gray-900">
                      {item.syllabusTitle}
                    </td>
                    <td className="p-4 text-gray-600">{item.subjectName}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        {item.courseName}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {item.courseCode}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Sem {item.semester}
                      </span>
                    </td>
                    <td className="p-4 text-center text-gray-600">{item.year}</td>
                    <td className="p-4 text-center text-gray-600">{item.creditHours}</td>
                    <td className="p-4 text-center text-gray-600">{item.lectureHours}</td>
                    <td className="p-4 text-center text-gray-600">{item.practicalHours}</td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/syllabus/viewsyllabus/${item.syllabusId}`}
                          className="px-2 py-1 text-xs rounded-lg text-green-700 bg-green-50 border border-green-200 hover:bg-green-100"
                        >
                          View PDF
                        </Link>
                        <Link
                          to={`/notes/add/${item.syllabusId}`}
                          className="px-2 py-1 text-xs rounded-lg text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100"
                        >
                          + Notes
                        </Link>
                        <Link
                          to={`/old-questions/add`}
                          state={{ syllabusId: item.syllabusId, courseId: item.courseId }}
                          className="px-2 py-1 text-xs rounded-lg text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100"
                        >
                          + Old Q
                        </Link>
                        <Link
                          to={`/syllabus/edit/${item.syllabusId}`}
                          state={{ syllabus: item }}
                          className="px-2 py-1 text-xs rounded-lg text-yellow-700 bg-yellow-50 border border-yellow-200 hover:bg-yellow-100"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(item.syllabusId)}
                          className="px-2 py-1 text-xs rounded-lg text-red-700 bg-red-50 border border-red-200 hover:bg-red-100"
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
      </div>

      {/* -------- PAGINATION -------- */}
      <Pagination
        page={page + 1}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default SyllabusTable;
