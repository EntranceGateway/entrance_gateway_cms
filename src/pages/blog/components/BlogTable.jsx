import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBlogs, useDeleteBlog } from "@/hooks/useBlogs";
import { getBlogFileUrl } from "@/http/blog";
import DataTable from "@/components/common/DataTable";
import ConfirmModal from "@/components/common/ConfirmModal";
import PageHeader from "@/components/common/PageHeader";
import LoadingState from "@/components/common/LoadingState";
import { Plus, Edit, Trash2, Eye, Calendar, Mail, Phone, Search } from "lucide-react";

const BlogTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState("createdDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Fetch Blogs using hook
  const { data, isLoading, error } = useBlogs({
    page,
    size: pageSize,
    sortBy: sortField,
    sortDir: sortOrder,
  });

  const deleteMutation = useDeleteBlog();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (err) {
      console.error("Delete Blog Error:", err);
    }
  };

  // Helper logic
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

  // Client-side filtering as per original requirement
  const filteredBlogs = useMemo(() => {
    const blogs = data?.content || [];
    if (!searchTerm) return blogs;
    return blogs.filter((blog) =>
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const columns = useMemo(
    () => [
      {
        key: "image",
        label: "Image",
        render: (row) =>
          row.imageName ? (
            <img
              src={getBlogFileUrl(row.blogId)}
              alt={row.title}
              className="h-10 w-14 object-cover rounded-lg border border-gray-100"
            />
          ) : (
            <div className="h-10 w-14 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 italic text-[10px] text-gray-400">
              No image
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
        key: "content",
        label: "Content Snippet",
        render: (row) => <div className="text-gray-500">{truncate(row.content, 50)}</div>,
      },
      {
        key: "contact",
        label: "Contact",
        render: (row) => (
          <div className="text-xs space-y-1">
            {row.contactEmail && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <Mail size={12} className="text-indigo-400" />
                <span>{truncate(row.contactEmail, 20)}</span>
              </div>
            )}
            {row.contactPhone && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <Phone size={12} className="text-green-400" />
                <span>{row.contactPhone}</span>
              </div>
            )}
            {!row.contactEmail && !row.contactPhone && <span className="text-gray-300">-</span>}
          </div>
        ),
      },
      {
        key: "createdDate",
        label: "Published",
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
              to={`/blogs/view/${row.blogId}`}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="View Blog"
            >
              <Eye size={18} />
            </Link>
            <Link
              to={`/blogs/edit/${row.blogId}`}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Edit Blog"
            >
              <Edit size={18} />
            </Link>
            <button
              onClick={() => setDeleteId(row.blogId)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Blog"
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
        <h3 className="text-xl font-bold mb-2">Failed to load blogs</h3>
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
        title="Blog Management"
        breadcrumbs={[{ label: "Blogs" }]}
        actions={[
          {
            label: "Create New Post",
            onClick: () => navigate("/blogs/add"),
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
          placeholder="Search articles by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm group-hover:border-gray-300"
        />
      </div>

      {isLoading ? (
        <LoadingState type="table" />
      ) : (
        <DataTable
          data={filteredBlogs}
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
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog? All associated content and images will be permanently removed."
        confirmText="Yes, Proceed"
        loading={deleteMutation.isLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default BlogTable;
