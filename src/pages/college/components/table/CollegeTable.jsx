// src/components/CollegeTable.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../../../Verification/Pagination";
import UniversalFilter from "../../../../Verification/UniversalFilter";
import { deleteColleges, getColleges } from "../../../../http/colleges";

const LIMIT = 15;

const CollegeTable = () => {
  const [colleges, setColleges] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});

  const token = localStorage.getItem("token");

  // Fetch colleges from API
  const fetchColleges = async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT, ...filters };
      const res = await getColleges(params, token);
      setColleges(res.data.colleges || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchColleges();
  }, [page, filters]);

  // Delete a college
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this college?")) return;
    try {
      await deleteColleges(id, token);
      fetchColleges(); // refresh table
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Colleges</h1>

      {/* Filter */}
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
              { value: "PUBLIC", label: "Public" },
            ],
          },
        ]}
        onFilter={(newFilters) => {
          setPage(1);
          setFilters(newFilters);
        }}
      />

      {/* Table */}
      <div className="bg-white shadow-md border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left font-medium text-gray-700">Name</th>
                <th className="p-4 text-left font-medium text-gray-700">Location</th>
                <th className="p-4 text-left font-medium text-gray-700">Affiliation</th>
                <th className="p-4 text-left font-medium text-gray-700">Contact</th>
                <th className="p-4 text-left font-medium text-gray-700">Email</th>
                <th className="p-4 text-left font-medium text-gray-700">Year</th>
                <th className="p-4 text-left font-medium text-gray-700">Type</th>
                <th className="p-4 text-center font-medium text-gray-700">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center p-6 text-gray-500">Loading...</td>
                </tr>
              ) : colleges.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-6 text-gray-500">No colleges found</td>
                </tr>
              ) : (
                colleges.map((college) => (
                  <tr key={college.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-gray-800 font-medium">{college.collegeName}</td>
                    <td className="p-4 text-gray-600">{college.location}</td>
                    <td className="p-4 text-gray-600">{college.affiliation}</td>
                    <td className="p-4 text-gray-600">{college.contact}</td>
                    <td className="p-4 text-gray-600">{college.email}</td>
                    <td className="p-4 text-gray-600">{college.establishedYear}</td>
                    <td className="p-4 text-gray-600">{college.collegeType}</td>
                    <td className="p-4 flex items-center justify-center gap-3">
                      <Link
                        to={`/edit-college/${college.id}`}
                        className="px-3 py-1.5 rounded-md text-blue-700 font-semibold border border-blue-200 hover:bg-blue-50 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(college.id)}
                        className="px-3 py-1.5 rounded-md text-red-700 font-semibold border border-red-200 hover:bg-red-50 transition"
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
      <div className="mt-6 flex justify-center">
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default CollegeTable;
