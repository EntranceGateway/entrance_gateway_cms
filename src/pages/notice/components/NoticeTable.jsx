import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotices, useDeleteNotice } from "@/hooks/useNotices";
import { getNoticeFileUrl } from "@/http/notice";
import DataTable from "@/components/common/DataTable";
import ConfirmModal from "@/components/common/ConfirmModal";
import PageHeader from "@/components/common/PageHeader";
import LoadingState from "@/components/common/LoadingState";
import { Plus, Edit, Trash2, Eye, Calendar, FileText, Search } from "lucide-react";

const NoticeTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState("createdDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Fetch Notices using hook
  const { data, isLoading, error } = useNotices({
    page,
    size: pageSize,
    sortBy: sortField,
    sortDir: sortOrder,
  });

  const deleteMutation = useDeleteNotice();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (err) {
      console.error("Delete Notice Error:", err);
    }
  };

  // Helper logic
  const isPdfFile = (filename) => filename?.toLowerCase().endsWith(".pdf");

  const truncate = (text, maxLength = 50) => {
    if (!text) return "-";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Client-side filtering
  const filteredNotices = useMemo(() => {
    const notices = data?.content || [];
    if (!searchTerm) return notices;
    return notices.filter((notice) =>
      notice.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const columns = useMemo(
    () => [
      {
        key: "file",
        label: "File",
        render: (row) =>
          row.imageName ? (
            isPdfFile(row.imageName) ? (
              <div className="h-10 w-14 bg-red-50 rounded-lg flex items-center justify-center border border-red-100" title="PDF File">
                <FileText size={20} className="text-red-500" />
              </div>
            ) : (
              <img
                src={getNoticeFileUrl(row.noticeId)}
                alt={row.title}
                className="h-10 w-14 object-cover rounded-lg border border-gray-100"
              />
            )
          ) : (
            <div className="h-10 w-14 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 italic text-[10px] text-gray-400">
              No file
            </div>
          ),
      },
      {
        key: "title",
        label: "Title",
        sortable: true,
        render: (row) => <div className="font-semibold text-gray-900">{truncate(row.title, 40)}</div>,
      },
      {
        key: "description",
        label: "Description",
        render: (row) => <div className="text-gray-500">{truncate(row.description, 60)}</div>,
      },
      {
        key: "createdDate",
        label: "Posted On",
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-1.5 text-gray-600">
            <Calendar size={14} className="text-gray-400" />
            <span>{formatDate(row.createdDate)}</span>
          </div>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <div className="flex items-center gap-2">
            <Link
              to={`/notices/view/${row.noticeId}`}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100"
              title="View Notice"
            >
              <Eye size={18} />
            </Link>
            <Link
              to={`/notices/edit/${row.noticeId}`}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
              title="Edit Notice"
            >
              <Edit size={18} />
            </Link>
            <button
              onClick={() => setDeleteId(row.noticeId)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
              title="Delete Notice"
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
        <h3 className="text-xl font-bold mb-2">Failed to load notices</h3>
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
        title="Notice Management"
        breadcrumbs={[{ label: "Notices" }]}
        actions={[
          {
            label: "Create Notice",
            onClick: () => navigate("/notices/add"),
            icon: <Plus size={18} />,
            variant: "primary",
          },
        ]}
      />

      <div className="mb-8 relative max-w-md group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm group-hover:border-gray-300"
        />
      </div>

      {isLoading ? (
        <LoadingState type="table" />
      ) : (
        <DataTable
          data={filteredNotices}
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
        title="Delete Notice"
        message="Are you sure you want to delete this notice? This action will permanently remove the record and any associated files."
        confirmText="Confirm Delete"
        loading={deleteMutation.isLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default NoticeTable;
