import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOldQuestions, useDeleteOldQuestion } from "@/hooks/useOldQuestions";
import { useCourses } from "@/hooks/useCourses";
import { getOldQuestionPdfUrl } from "@/http/oldQuestionCollection";
import DataTable from "@/components/common/DataTable";
import ConfirmModal from "@/components/common/ConfirmModal";
import PageHeader from "@/components/common/PageHeader";
import LoadingState from "@/components/common/LoadingState";
import { Plus, Edit, Trash2, Eye, Calendar, Filter, X } from "lucide-react";

// Affiliation options (standardized)
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
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter states
  const [affiliation, setAffiliation] = useState("");
  const [courseId, setCourseId] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [setName, setSetName] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Fetch all courses for filtering
  const { data: coursesData } = useCourses({ size: 1000 });
  const allCourses = useMemo(() => coursesData?.content || [], [coursesData]);

  // Filter courses based on affiliation
  const filteredCourses = useMemo(() => {
    if (!affiliation) return [];
    return allCourses.filter((c) => c.affiliation === affiliation);
  }, [affiliation, allCourses]);

  // Fetch Old Questions using hook
  const { data, isLoading, error } = useOldQuestions({
    page,
    size: pageSize,
    sortBy: sortField,
    sortDir: sortOrder,
    ...(courseId && { courseId }),
    ...(semester && { semester: parseInt(semester) }),
    ...(year && { year: parseInt(year) }),
    ...(!courseId && setName && { setName }),
  });

  const deleteMutation = useDeleteOldQuestion();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (err) {
      console.error("Delete Question Error:", err);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "setName",
        label: "Set Name",
        sortable: true,
        render: (row) => <span className="font-semibold text-gray-900">{row.setName}</span>,
      },
      {
        key: "subject",
        label: "Subject",
        sortable: true,
        render: (row) => (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            {row.subject || "N/A"}
          </span>
        ),
      },
      {
        key: "courseName",
        label: "Course",
        sortable: true,
        render: (row) => (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-50 text-purple-700 border border-purple-100">
            {row.courseName || "N/A"}
          </span>
        ),
      },
      { key: "year", label: "Year", sortable: true },
      {
        key: "description",
        label: "Description",
        render: (row) => <div className="max-w-xs truncate text-gray-500" title={row.description}>{row.description || "-"}</div>,
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <div className="flex items-center gap-2">
            <a
              href={getOldQuestionPdfUrl(row.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="View PDF"
            >
              <Eye size={18} />
            </a>
            <Link
              to={`/old-questions/edit/${row.id}`}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit size={18} />
            </Link>
            <button
              onClick={() => setDeleteId(row.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const clearFilters = () => {
    setAffiliation("");
    setCourseId("");
    setSemester("");
    setYear("");
    setSetName("");
    setPage(0);
  };

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl border border-red-100 max-w-2xl mx-auto mt-10">
        <h3 className="text-xl font-bold mb-2">Failed to load question collection</h3>
        <p>{error.message || "An unexpected error occurred."}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Old Question Collection"
        breadcrumbs={[{ label: "Old Questions" }]}
        actions={[
          {
            label: "Add Collection",
            onClick: () => navigate("/old-questions/add"),
            icon: <Plus size={18} />,
            variant: "primary",
          },
        ]}
      />

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-gray-700 font-semibold">
            <Filter size={18} className="text-indigo-500" />
            <span>Search Filters</span>
          </div>
          {(affiliation || courseId || semester || year || setName) && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
            >
              <X size={14} />
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Affiliation</label>
            <select
              value={affiliation}
              onChange={(e) => {
                setAffiliation(e.target.value);
                setCourseId("");
                setSemester("");
                setPage(0);
              }}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-sm transition-all"
            >
              <option value="">All Affiliations</option>
              {AFFILIATIONS.map((aff) => (
                <option key={aff.value} value={aff.value}>{aff.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Course</label>
            <select
              value={courseId}
              onChange={(e) => {
                setCourseId(e.target.value);
                setSemester("");
                setPage(0);
              }}
              disabled={!affiliation}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-sm transition-all disabled:opacity-50"
            >
              <option value="">{!affiliation ? "Select Affiliation" : "All Courses"}</option>
              {filteredCourses.map((c) => (
                <option key={c.courseId} value={c.courseId}>{c.courseName}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Semester</label>
            <input
              type="number"
              placeholder="1-8"
              value={semester}
              onChange={(e) => { setSemester(e.target.value); setPage(0); }}
              disabled={!courseId}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-sm transition-all disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Year</label>
            <input
              type="number"
              placeholder="YYYY"
              value={year}
              onChange={(e) => { setYear(e.target.value); setPage(0); }}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-sm transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Set Name</label>
            <input
              type="text"
              placeholder="Search set..."
              value={setName}
              onChange={(e) => { setSetName(e.target.value); setPage(0); }}
              disabled={!!courseId}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none text-sm transition-all disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingState type="table" />
      ) : (
        <DataTable
          data={data?.content || []}
          columns={columns}
          loading={isLoading}
          pagination={{
            currentPage: page,
            totalPages: data?.totalPages || 0,
            totalItems: data?.totalItems || 0,
            pageSize: pageSize,
          }}
          onPageChange={setPage}
          onSort={(key, dir) => {
            setSortField(key);
            setSortOrder(dir);
          }}
        />
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Question Collection"
        message="Are you sure you want to delete this collection item? This action cannot be undone."
        confirmText="Delete Permanently"
        loading={deleteMutation.isLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default OldQuestionTable;
