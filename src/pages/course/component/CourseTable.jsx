import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCourses, useDeleteCourse } from "@/hooks/useCourses";
import DataTable from "@/components/common/DataTable";
import ConfirmModal from "@/components/common/ConfirmModal";
import PageHeader from "@/components/common/PageHeader";
import { TableSkeleton } from "@/components/loaders";
import Badge from "@/components/common/Badge";
import { Plus, Edit, Trash2, FileText, Search, Filter, X, ChevronRight } from "lucide-react";

// Affiliation options (standardized)
const AFFILIATIONS = [
  { value: "NEB", label: "NEB (National Examination Board)" },
  { value: "TRIBHUVAN_UNIVERSITY", label: "Tribhuvan University" },
  { value: "POKHARA_UNIVERSITY", label: "Pokhara University" },
  { value: "KATHMANDU_UNIVERSITY", label: "Kathmandu University" },
  { value: "PURWANCHAL_UNIVERSITY", label: "Purwanchal University" },
  { value: "MID_WESTERN_UNIVERSITY", label: "Mid Western University" },
  { value: "FAR_WESTERN_UNIVERSITY", label: "Far Western University" },
  { value: "LUMBINI_UNIVERSITY", label: "Lumbini University" },
  { value: "CAMPUS_AFFILIATED_TO_FOREIGN_UNIVERSITY", label: "Foreign University" },
];

const CourseTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter state
  const [affiliation, setAffiliation] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Fetch Courses using hook
  const { data, isLoading, error } = useCourses({
    page,
    size: pageSize,
    sortBy: sortField,
    sortDir: sortOrder,
    ...(affiliation && { affiliation }),
  });

  const deleteMutation = useDeleteCourse();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (err) {
      console.error("Delete Course Error:", err);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "courseName",
        label: "Course Name",
        sortable: true,
        render: (row) => (
          <div className="flex flex-col">
            <span className="font-bold text-gray-900">{row.courseName}</span>
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-0.5">{row.courseId}</span>
          </div>
        ),
      },
      {
        key: "description",
        label: "Description/Criteria",
        render: (row) => (
          <div className="max-w-xs">
            <div className="text-xs text-gray-600 truncate mb-1" title={row.description}>
              {row.description || "No description"}
            </div>
            <div className="text-[10px] text-gray-400 italic truncate" title={row.criteria}>
              {row.criteria ? `Criteria: ${row.criteria}` : "No criteria defined"}
            </div>
          </div>
        ),
      },
      {
        key: "courseLevel",
        label: "Level & Type",
        render: (row) => (
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="code" className="uppercase">
              {row.courseLevel?.replace(/_/g, " ") || "N/A"}
            </Badge>
            <Badge variant="course" className="uppercase">
              {row.courseType?.replace(/_/g, " ") || "N/A"}
            </Badge>
          </div>
        ),
      },
      {
        key: "affiliation",
        label: "Affiliation",
        render: (row) => (
          <Badge variant="affiliation">
             {row.affiliation?.replace(/_/g, " ")}
          </Badge>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <div className="flex items-center gap-2">
            <Link
              to={`/syllabus/add/${row.courseId}`}
              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Add Syllabus"
            >
              <FileText size={18} />
            </Link>
            <Link
              to={`/course/edit/${row.courseId}`}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Edit Course"
            >
              <Edit size={18} />
            </Link>
            <button
              onClick={() => setDeleteId(row.courseId)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Course"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl border border-red-100 max-w-2xl mx-auto mt-10">
        <h3 className="text-xl font-bold mb-2">Failed to load courses</h3>
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
        title="Course Management"
        breadcrumbs={[{ label: "Courses" }]}
        actions={[
          {
            label: "Create New Course",
            onClick: () => navigate("/course/add"),
            icon: <Plus size={18} />,
            variant: "primary",
          },
        ]}
      />

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
              <Filter size={20} />
            </div>
            <h3 className="font-bold text-gray-800">Filter Courses</h3>
          </div>
          {affiliation && (
            <button
              onClick={() => { setAffiliation(""); setPage(0); }}
              className="text-sm font-semibold text-red-500 hover:text-red-600 flex items-center gap-1.5 transition-colors"
            >
              <X size={14} />
              Clear Filter
            </button>
          )}
        </div>

        <div className="max-w-md">
          <select
            value={affiliation}
            onChange={(e) => { setAffiliation(e.target.value); setPage(0); }}
            className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-medium appearance-none"
          >
            <option value="">All Affiliations</option>
            {AFFILIATIONS.map((aff) => (
              <option key={aff.value} value={aff.value}>{aff.label}</option>
            ))}
          </select>
          {affiliation && (
            <p className="mt-2 text-[11px] text-gray-500 italic ml-1">
              * Sorting is handled by the server preference for this affiliation view.
            </p>
          )}
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={10} columns={7} />
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
            if (!affiliation) {
              setSortField(key);
              setSortOrder(dir);
            }
          }}
        />
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Course"
        message="Are you sure you want to delete this course? This will not remove associated syllabus items but will break the reference. This action is permanent."
        confirmText="Yes, Delete Course"
        loading={deleteMutation.isLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default CourseTable;
