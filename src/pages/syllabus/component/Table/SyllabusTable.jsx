import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../../../Verification/Pagination";
import UniversalFilter from "../../../../Verification/UniversalFilter";
import { deleteSyllabus, getSyllabus, getSyllabusFile } from "../../../../http/syllabus";

const PAGE_SIZE = 5;

const SyllabusTable = () => {
  const [allSyllabus, setAllSyllabus] = useState([]);
  const [filteredSyllabus, setFilteredSyllabus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const token = localStorage.getItem("token");

  // ---------------- FETCH DATA ----------------
  const fetchSyllabus = async () => {
    setLoading(true);
    try {
      const res = await getSyllabus({}, token);
      const data = res.data.data.content || [];
      setAllSyllabus(data);
      setFilteredSyllabus(data);
    } catch (err) {
      console.error("Fetch syllabus error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSyllabus();
  }, []);

  // ---------------- FILTER FUNCTION ----------------
  const handleFilter = (filters) => {
    let data = [...allSyllabus];

    if (filters.courseName)
      data = data.filter((s) =>
        s.courseName.toLowerCase().includes(filters.courseName.toLowerCase())
      );

    if (filters.syllabusTitle)
      data = data.filter((s) =>
        s.syllabusTitle.toLowerCase().includes(filters.syllabusTitle.toLowerCase())
      );

    if (filters.semester)
      data = data.filter(
        (s) => s.semester.toLowerCase() === filters.semester.toLowerCase()
      );

    if (filters.year)
      data = data.filter((s) => String(s.year) === String(filters.year));

    setFilteredSyllabus(data);
    setPage(1);
  };

  // ---------------- DELETE HANDLER ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this syllabus?")) return;

    try {
      await deleteSyllabus(id, token);
      fetchSyllabus();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  

  // ---------------- PAGINATION ----------------
  const totalPages = Math.ceil(filteredSyllabus.length / PAGE_SIZE);
  const paginated = filteredSyllabus.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // ---------------- RENDER ----------------
  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Syllabus List</h1>

      {/* -------- FILTER UI -------- */}
      <UniversalFilter
        config={[
          { name: "courseName", label: "Course Name", type: "text", placeholder: "Search course name" },
          { name: "syllabusTitle", label: "Title", type: "text", placeholder: "Search syllabus title" },
          { name: "semester", label: "Semester", type: "text", placeholder: "e.g. First, Second..." },
          { name: "year", label: "Year", type: "number", placeholder: "Search year" },
        ]}
        onFilter={handleFilter}
      />

      {/* -------- TABLE -------- */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {[
                  "Course Name",
                  "Course Code",
                  "Title",
                  "Semester",
                  "Year",
                  "Credit Hrs",
                  "Lecture Hrs",
                  "Practical Hrs",
                  "Action",
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
                  <td colSpan={9} className="p-6 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-gray-500">
                    No syllabus found
                  </td>
                </tr>
              ) : (
                paginated.map((syllabus) => (
                  <tr key={syllabus.syllabusId} className="hover:bg-gray-50 transition">
                    <td className="p-4">{syllabus.courseName}</td>
                    <td className="p-4">{syllabus.courseCode}</td>
                    <td className="p-4">{syllabus.syllabusTitle}</td>
                    <td className="p-4">{syllabus.semester}</td>
                    <td className="p-4">{syllabus.year}</td>
                    <td className="p-4">{syllabus.creditHours}</td>
                    <td className="p-4">{syllabus.lectureHours}</td>
                    <td className="p-4">{syllabus.practicalHours}</td>

                    <td className="p-4 flex gap-3">
                      <Link
                        to={`/syllabus/edit/${syllabus.syllabusId}`}
                        state={{ syllabus }}
                        className="px-3 py-1.5 rounded-xl text-blue-700 border border-blue-300 hover:bg-blue-50"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(syllabus.syllabusId)}
                        className="px-3 py-1.5 rounded-xl text-red-700 border border-red-300 hover:bg-red-50"
                      >
                        Delete
                      </button>

                    
                     <Link
                      to={`/syllabus/viewsyllabus/${syllabus.syllabusId}`}
                        className="px-3 py-1.5 rounded-xl text-green-700 border border-green-300 hover:bg-green-50"
                      >
                        View PDF
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* -------- PAGINATION -------- */}
      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
    </div>
  );
};

export default SyllabusTable;
