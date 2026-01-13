import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useColleges, useDeleteCollege } from "@/hooks/useColleges";
import DataTable from "@/components/common/DataTable";
import ConfirmModal from "@/components/common/ConfirmModal";
import PageHeader from "@/components/common/PageHeader";
import { TableSkeleton } from "@/components/loaders";
import { BookOpen, Plus, Edit, Trash2, Globe, MapPin, Mail, Phone, Info, Search, Filter, X } from "lucide-react";

const CollegeTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter states
  const [collegeName, setCollegeName] = useState("");
  const [location, setLocation] = useState("");
  const [collegeType, setCollegeType] = useState("");
  const [priority, setPriority] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Fetch Colleges using hook
  const { data, isLoading, error } = useColleges({
    page,
    size: pageSize,
    sortBy: sortField,
    sortDir: sortOrder,
    ...(collegeName && { collegeName }),
    ...(location && { location }),
    ...(collegeType && { collegeType }),
    ...(priority && { priority }),
  });

  const deleteMutation = useDeleteCollege();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (err) {
      console.error("Delete College Error:", err);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "collegeName",
        label: "College Details",
        sortable: true,
        render: (row) => (
          <div className="flex flex-col">
            <span className="font-bold text-gray-900">{row.collegeName}</span>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
              <MapPin size={12} className="text-gray-400" />
              <span>{row.location}</span>
            </div>
          </div>
        ),
      },
      {
        key: "affiliation",
        label: "Affiliation",
        render: (row) => (
          <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
            {row.affiliation?.replace(/_/g, " ")}
          </span>
        ),
      },
      {
        key: "priority",
        label: "Priority",
        sortable: true,
        render: (row) => {
          const styles = {
            HIGH: "bg-red-50 text-red-600 border-red-100",
            MEDIUM: "bg-amber-50 text-amber-600 border-amber-100",
            LOW: "bg-emerald-50 text-emerald-600 border-emerald-100",
          };
          return (
            <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full border ${styles[row.priority] || "bg-gray-50 text-gray-600"}`}>
              {row.priority}
            </span>
          );
        },
      },
      {
        key: "courses",
        label: "Courses",
        render: (row) => (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100">
              <BookOpen size={12} />
              {row.courses?.length || 0}
            </span>
            {row.courses?.length > 0 && (
              <div className="relative group/pop">
                <Info size={14} className="text-gray-400 cursor-help hover:text-indigo-500 transition-colors" />
                <div className="absolute z-50 invisible group-hover/pop:visible opacity-0 group-hover/pop:opacity-100 transition-all bottom-full left-0 mb-2 w-64 p-4 bg-white border border-gray-100 rounded-2xl shadow-2xl scale-95 group-hover/pop:scale-100">
                  <h4 className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                    <BookOpen size={12} className="text-indigo-500" />
                    Available Courses
                  </h4>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {row.courses.map((c) => (
                      <div key={c.courseId} className="text-[11px] text-gray-600 flex items-start gap-2 bg-gray-50 p-1.5 rounded-lg border border-transparent hover:border-indigo-100 transition-all">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span className="truncate">{c.courseName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ),
      },
      {
        key: "contacts",
        label: "Contacts",
        render: (row) => (
          <div className="flex flex-col gap-1 text-[11px]">
            {row.email && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <Mail size={12} className="text-gray-400" />
                <span>{row.email}</span>
              </div>
            )}
            {row.contact && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <Phone size={12} className="text-gray-400" />
                <span>{row.contact}</span>
              </div>
            )}
            {row.website && (
              <a href={row.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-medium">
                <Globe size={12} />
                <span>Website</span>
              </a>
            )}
          </div>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <div className="flex items-center gap-1.5">
            <Link
              to={`/college/${row.collegeId}/courses`}
              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100"
              title="Manage Courses"
            >
              <Plus size={18} />
            </Link>
            <Link
              to={`/college/edit/${row.collegeId}`}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100"
              title="Edit College"
            >
              <Edit size={18} />
            </Link>
            <button
              onClick={() => setDeleteId(row.collegeId)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
              title="Delete College"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const resetFilters = () => {
    setCollegeName("");
    setLocation("");
    setCollegeType("");
    setPriority("");
    setPage(0);
  };

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl border border-red-100 max-w-2xl mx-auto mt-10">
        <h3 className="text-xl font-bold mb-2">Failed to load colleges</h3>
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
        title="College Portal"
        breadcrumbs={[{ label: "Colleges" }]}
        actions={[
          {
            label: "Registration",
            onClick: () => navigate("/college/add"),
            icon: <Plus size={18} />,
            variant: "primary",
          },
        ]}
      />

      {/* Modern Filter Bar */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
              <Filter size={20} />
            </div>
            <h3 className="font-bold text-gray-800">Advanced Search</h3>
          </div>
          {(collegeName || location || collegeType || priority) && (
            <button
              onClick={resetFilters}
              className="text-sm font-semibold text-red-500 hover:text-red-600 flex items-center gap-1.5 transition-colors"
            >
              <X size={14} />
              Reset All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name..."
              value={collegeName}
              onChange={(e) => { setCollegeName(e.target.value); setPage(0); }}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-medium"
            />
          </div>

          <div className="relative group">
            <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by location..."
              value={location}
              onChange={(e) => { setLocation(e.target.value); setPage(0); }}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-medium"
            />
          </div>

          <div className="space-y-1">
            <select
              value={collegeType}
              onChange={(e) => { setCollegeType(e.target.value); setPage(0); }}
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-medium appearance-none"
            >
              <option value="">Institution Type</option>
              <option value="PRIVATE">Private</option>
              <option value="COMMUNITY">Community</option>
              <option value="GOVERNMENT">Government</option>
            </select>
          </div>

          <div className="space-y-1">
            <select
              value={priority}
              onChange={(e) => { setPriority(e.target.value); setPage(0); }}
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-medium appearance-none"
            >
              <option value="">Priority Level</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={10} columns={8} />
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
        title="Remove Institution"
        message="Are you sure you want to delete this college? All associated records, courses, and media will be permanently deleted. This action cannot be reversed."
        confirmText="Confirm Removal"
        loading={deleteMutation.isLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default CollegeTable;
