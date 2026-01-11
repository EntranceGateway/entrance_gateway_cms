// src/pages/syllabus/component/Table/SyllabusTable.jsx
import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSyllabus, useDeleteSyllabus } from "@/hooks/useSyllabus";
import DataTable from "@/components/common/DataTable";
import ConfirmModal from "@/components/common/ConfirmModal";
import PageHeader from "@/components/common/PageHeader";
import LoadingState from "@/components/common/LoadingState";
import Badge from "@/components/common/Badge";
import { Plus, Eye, Edit, Trash2, FilePlus } from "lucide-react";

const PAGE_SIZE = 10;

const SyllabusTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState("syllabusTitle");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter states
  const [affiliation, setAffiliation] = useState("");
  const [courseName, setCourseName] = useState("");
  const [semester, setSemester] = useState("");

  const [deleteId, setDeleteId] = useState(null);

  // Fetch data using hook
  const { data, isLoading, error } = useSyllabus({
    page,
    size: PAGE_SIZE,
    sortBy: sortField,
    sortDir: sortOrder,
    ...(affiliation && { affiliation }),
    ...(courseName && { courseName }),
    ...(semester && { semester: String(semester) }),
  });

  const deleteMutation = useDeleteSyllabus();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (err) {
      console.error("Delete Syllabus Error:", err);
    }
  };

  const columns = useMemo(
    () => [
      { key: "syllabusTitle", label: "Title", sortable: true },
      { key: "subjectName", label: "Subject" },
      {
        key: "courseName",
        label: "Course",
        render: (row) => <Badge variant="course">{row.courseName}</Badge>,
      },
      {
        key: "courseCode",
        label: "Code",
        render: (row) => <Badge variant="code">{row.courseCode}</Badge>,
      },
      {
        key: "semester",
        label: "Sem",
        sortable: true,
        render: (row) => <Badge variant="semester">Sem {row.semester}</Badge>,
      },
      { key: "year", label: "Year" },
      { key: "creditHours", label: "Cr. Hrs", render: (row) => row.creditHours || "-" },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <div className="flex items-center gap-2">
            <Link
              to={`/syllabus/viewsyllabus/${row.syllabusId}`}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="View PDF"
            >
              <Eye size={18} />
            </Link>
            <Link
              to={`/notes/add`}
              state={{ syllabusId: row.syllabusId }}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Add Note"
            >
              <Plus size={18} />
            </Link>
             <Link
                to={`/old-questions/add`}
                state={{ syllabusId: row.syllabusId, courseId: row.courseId }}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Add Old Q"
            >
                <FilePlus size={18} />
            </Link>
            <Link
              to={`/syllabus/edit/${row.syllabusId}`}
              state={{ syllabus: row }}
              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit size={18} />
            </Link>
            <button
              onClick={() => setDeleteId(row.syllabusId)}
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

  const headerActions = [
    {
      label: "Add New Syllabus",
      onClick: () => navigate("/syllabus/add"),
      icon: <Plus size={18} />,
      variant: "primary",
    },
  ];

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl border border-red-100 max-w-2xl mx-auto mt-10">
        <h3 className="text-xl font-bold mb-2">Failed to load syllabus</h3>
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
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="Syllabus Management"
        breadcrumbs={[{ label: "Syllabus" }]}
        actions={headerActions}
      />

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
           <label className="block text-sm font-semibold text-gray-700 mb-1.5">Affiliation</label>
           <select
             value={affiliation}
             onChange={(e) => {
               setAffiliation(e.target.value);
               setPage(0);
             }}
             className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-gray-700"
           >
             <option value="">All Affiliations</option>
             <option value="TRIBHUVAN_UNIVERSITY">Tribhuvan University</option>
             <option value="POKHARA_UNIVERSITY">Pokhara University</option>
             <option value="KATHMANDU_UNIVERSITY">Kathmandu University</option>
             <option value="PURWANCHAL_UNIVERSITY">Purwanchal University</option>
             <option value="MID_WESTERN_UNIVERSITY">Mid Western University</option>
             <option value="FAR_WESTERN_UNIVERSITY">Far Western University</option>
             <option value="LUMBINI_UNIVERSITY">Lumbini University</option>
             <option value="CAMPUS_AFFILIATED_TO_FOREIGN_UNIVERSITY">Foreign University</option>
           </select>
        </div>
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Course Name</label>
            <input
              type="text"
              placeholder="Filter by Course..."
              value={courseName}
              onChange={(e) => {
                setCourseName(e.target.value);
                setPage(0);
              }}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-gray-700"
            />
        </div>
        <div className="flex gap-4 items-end">
             <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Semester</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  placeholder="Sem"
                  value={semester}
                  onChange={(e) => {
                    setSemester(e.target.value);
                    setPage(0);
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-gray-700"
                />
             </div>
             {(affiliation || courseName || semester) && (
              <button
                onClick={() => {
                  setAffiliation("");
                  setCourseName("");
                  setSemester("");
                  setPage(0);
                }}
                className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 font-medium transition-colors"
               >
                 Clear
               </button>
             )}
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
            totalItems: data?.totalElements || 0,
            pageSize: PAGE_SIZE,
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
        title="Delete Syllabus"
        message="Are you sure you want to delete this syllabus? This action cannot be undone."
        confirmText="Delete"
        loading={deleteMutation.isLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default SyllabusTable;
