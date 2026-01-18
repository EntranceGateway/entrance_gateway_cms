import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotes, useDeleteNote } from "@/hooks/useNotes";
import DataTable from "@/components/common/DataTable";
import ConfirmModal from "@/components/common/ConfirmModal";
import PageHeader from "@/components/common/PageHeader";
import { TableSkeleton } from "@/components/loaders";
import { Plus, Edit, Trash2 } from "lucide-react";

const NoteTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState("noteName");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter states
  const [affiliation, setAffiliation] = useState("");
  const [courseName, setCourseName] = useState("");
  const [semester, setSemester] = useState("");

  const [deleteId, setDeleteId] = useState(null);

  // Fetch notes using hook
  const { data, isLoading, error } = useNotes({
    page,
    size: pageSize,
    sortBy: sortField,
    sortDir: sortOrder,
    ...(affiliation && { affiliation }),
    ...(courseName && { courseName }),
    ...(semester && { semester: parseInt(semester) }),
  });

  const deleteMutation = useDeleteNote();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (err) {
      console.error("Delete Note Error:", err);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "subject",
        label: "Subject",
        sortable: true,
        render: (row) => (
          <div>
            <div className="font-semibold text-gray-900">{row.subject}</div>
            {row.subjectCode && (
              <div className="text-xs text-gray-500 mt-0.5">Code: {row.subjectCode}</div>
            )}
          </div>
        ),
      },
      {
        key: "courseName",
        label: "Course",
        render: (row) => (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
            {row.courseName || "N/A"}
          </span>
        ),
      },
      {
        key: "semester",
        label: "Semester",
        sortable: true,
        align: "right",
        render: (row) => (
          <span className="font-medium text-gray-900">
            {row.semester ? `Sem ${row.semester}` : "-"}
          </span>
        ),
      },
      {
        key: "year",
        label: "Year",
        align: "right",
        render: (row) => (
          <span className="font-medium text-gray-900">{row.year || "-"}</span>
        ),
      },
      {
        key: "affiliation",
        label: "Affiliation",
        render: (row) => (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
            {row.affiliation?.replace(/_/g, " ") || "N/A"}
          </span>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Link
              to={`/notes/edit/${row.noteId}`}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Edit Note"
            >
              <Edit size={18} />
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteId(row.noteId);
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Note"
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
      label: "Add New Note",
      onClick: () => navigate("/notes/add"),
      icon: <Plus size={18} />,
      variant: "primary",
    },
  ];

  const breadcrumbs = [{ label: "Notes" }];

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl border border-red-100 max-w-2xl mx-auto mt-10">
        <h3 className="text-xl font-bold mb-2">Failed to load notes</h3>
        <p>{error.message || "An unexpected error occurred while fetching data."}</p>
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
      <PageHeader title="Notes Management" breadcrumbs={breadcrumbs} actions={headerActions} />

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">Affiliation</label>
          <select
            value={affiliation}
            onChange={(e) => {
              setAffiliation(e.target.value);
              setPage(0);
            }}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-gray-700"
          >
            <option value="">All Affiliations</option>
            <option value="NEB">NEB (National Examination Board)</option>
            <option value="TRIBHUVAN_UNIVERSITY">Tribhuvan University</option>
            <option value="POKHARA_UNIVERSITY">Pokhara University</option>
            <option value="KATHMANDU_UNIVERSITY">Kathmandu University</option>
            {/* ... other options */}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">Course Name</label>
          <input
            type="text"
            placeholder="Search course..."
            value={courseName}
            onChange={(e) => {
              setCourseName(e.target.value);
              setPage(0);
            }}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-gray-700"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 ml-1">Semester</label>
          <input
            type="number"
            min="1"
            max="8"
            placeholder="Semester"
            value={semester}
            onChange={(e) => {
              setSemester(e.target.value);
              setPage(0);
            }}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-gray-700"
          />
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={10} columns={6} />
      ) : (
        <DataTable
          data={data?.content || []}
          columns={columns}
          loading={isLoading}
          onRowClick={(row) => navigate(`/notes/viewnotes/${row.noteId}`)}
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
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete"
        loading={deleteMutation.isLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default NoteTable;
