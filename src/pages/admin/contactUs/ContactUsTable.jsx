import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useContactMessages, useDeleteContactMessage } from "@/hooks/useContactUs";
import Layout from "@/components/layout/Layout";
import DataTable from "@/components/common/DataTable";
import ConfirmModal from "@/components/common/ConfirmModal";
import PageHeader from "@/components/common/PageHeader";
import { TableSkeleton } from "@/components/loaders";
import { Mail, Phone, User, MessageSquare, Trash2, Eye, Search, Filter, X } from "lucide-react";

const ContactUsTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter states
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Fetch contact messages
  const { data, isLoading, error } = useContactMessages({
    page,
    size: pageSize,
    sortBy: sortField,
    sortDir: sortOrder,
    ...(nameFilter && { name: nameFilter }),
    ...(emailFilter && { email: emailFilter }),
    ...(subjectFilter && { subject: subjectFilter }),
  });

  const deleteMutation = useDeleteContactMessage();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const getSubjectBadge = (subject) => {
    const styles = {
      GENERAL_INQUIRY: "bg-blue-50 text-blue-600 border-blue-200",
      TECHNICAL_SUPPORT: "bg-red-50 text-red-600 border-red-200",
      BILLING_ISSUES: "bg-amber-50 text-amber-600 border-amber-200",
      FEEDBACK_SUGGESTIONS: "bg-green-50 text-green-600 border-green-200",
      COURSE_INFORMATION: "bg-indigo-50 text-indigo-600 border-indigo-200",
      COLLABORATION_OPPORTUNITIES: "bg-purple-50 text-purple-600 border-purple-200",
      OTHER: "bg-gray-50 text-gray-600 border-gray-200",
    };
    return styles[subject] || styles.OTHER;
  };

  const columns = useMemo(
    () => [
      {
        key: "name",
        label: "Contact Details",
        sortable: true,
        render: (row) => (
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <User size={14} className="text-gray-400" />
              <span className="font-bold text-gray-900">{row.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <Mail size={12} className="text-gray-400" />
              <span>{row.email}</span>
            </div>
            {row.phone && (
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                <Phone size={12} className="text-gray-400" />
                <span>{row.phone}</span>
              </div>
            )}
          </div>
        ),
      },
      {
        key: "subject",
        label: "Subject",
        sortable: true,
        render: (row) => (
          <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getSubjectBadge(row.subject)}`}>
            {row.subject?.replace(/_/g, " ")}
          </span>
        ),
      },
      {
        key: "message",
        label: "Message",
        render: (row) => (
          <div className="max-w-md">
            <p className="text-sm text-gray-700 line-clamp-2">{row.message}</p>
          </div>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/contact-us/view/${row.id}`);
              }}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100"
              title="View Details"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteId(row.id);
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
              title="Delete Message"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ),
      },
    ],
    [navigate]
  );

  const resetFilters = () => {
    setNameFilter("");
    setEmailFilter("");
    setSubjectFilter("");
    setPage(0);
  };

  if (error) {
    return (
      <Layout>
        <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl border border-red-100 max-w-2xl mx-auto mt-10">
          <h3 className="text-xl font-bold mb-2">Failed to load contact messages</h3>
          <p>{error.message || "An unexpected error occurred."}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader
          title="Contact Messages"
          breadcrumbs={[{ label: "Contact Us" }]}
          icon={MessageSquare}
        />

        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                <Filter size={20} />
              </div>
              <h3 className="font-bold text-gray-800">Filter Messages</h3>
            </div>
            {(nameFilter || emailFilter || subjectFilter) && (
              <button
                onClick={resetFilters}
                className="text-sm font-semibold text-red-500 hover:text-red-600 flex items-center gap-1.5 transition-colors"
              >
                <X size={14} />
                Reset All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative group">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by name..."
                value={nameFilter}
                onChange={(e) => { setNameFilter(e.target.value); setPage(0); }}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-medium"
              />
            </div>

            <div className="relative group">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by email..."
                value={emailFilter}
                onChange={(e) => { setEmailFilter(e.target.value); setPage(0); }}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-medium"
              />
            </div>

            <select
              value={subjectFilter}
              onChange={(e) => { setSubjectFilter(e.target.value); setPage(0); }}
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm font-medium appearance-none"
            >
              <option value="">All Subjects</option>
              <option value="GENERAL_INQUIRY">General Inquiry</option>
              <option value="TECHNICAL_SUPPORT">Technical Support</option>
              <option value="BILLING_ISSUES">Billing Issues</option>
              <option value="FEEDBACK_SUGGESTIONS">Feedback & Suggestions</option>
              <option value="COURSE_INFORMATION">Course Information</option>
              <option value="COLLABORATION_OPPORTUNITIES">Collaboration Opportunities</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton rows={10} columns={4} />
        ) : (
          <DataTable
            data={data?.content || []}
            columns={columns}
            loading={isLoading}
            pagination={{
              currentPage: page,
              totalPages: data?.totalPages || 0,
              totalItems: data?.totalElements || 0,
              pageSize: pageSize,
            }}
            onPageChange={setPage}
            onSort={(key, dir) => {
              setSortField(key);
              setSortOrder(dir);
            }}
            onRowClick={(row) => navigate(`/admin/contact-us/view/${row.id}`)}
          />
        )}

        <ConfirmModal
          isOpen={!!deleteId}
          title="Delete Contact Message"
          message="Are you sure you want to delete this contact message? This action cannot be undone."
          confirmText="Delete Message"
          loading={deleteMutation.isLoading}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      </div>
    </Layout>
  );
};

export default ContactUsTable;
