import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBlogs, deleteBlog } from "../../../http/blog";
import Pagination from "../../../Verification/Pagination";
import { Plus, Edit, Trash2, Eye, Calendar, Mail, Phone } from "lucide-react";

const BlogTable = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 10;

  const [sortField, setSortField] = useState("createdDate");
  const [sortOrder, setSortOrder] = useState("desc");

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  // Fetch Blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: PAGE_SIZE,
        sortBy: sortField,
        sortDir: sortOrder,
      };

      const res = await getBlogs(params, token);
      const responseData = res.data.data || res.data;
      const data = responseData.content || [];
      setBlogs(data);
      setTotalPages(responseData.totalPages || 0);
    } catch (err) {
      console.error("Fetch Blogs Error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortField, sortOrder]);

  // Delete Blog
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await deleteBlog(id, token);
      fetchBlogs();
    } catch (err) {
      console.error("Delete Blog Error:", err);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage - 1);
  };

  // Filter blogs by search term (client-side)
  const filteredBlogs = blogs.filter((blog) =>
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Truncate text helper
  const truncate = (text, maxLength = 50) => {
    if (!text) return "-";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Blogs</h1>
        <Link
          to="/blogs/add"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200"
        >
          <Plus size={20} />
          Add New Blog
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Sort Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={sortField}
              onChange={(e) => {
                setSortField(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="createdDate">Created Date</option>
              <option value="title">Title</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Image", "Title", "Content", "Contact", "Meta Title", "Date", "Actions"].map(
                  (col) => (
                    <th
                      key={col}
                      className="p-4 text-left font-medium text-gray-700"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <span className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></span>
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No blogs found.
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr
                    key={blog.blogId}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    {/* Image */}
                    <td className="p-4">
                      {blog.imageName ? (
                        <img
                          src={`https://api.entrancegateway.com/images/${blog.imageName}`}
                          alt={blog.title}
                          className="h-12 w-16 object-cover rounded-md"
                        />
                      ) : (
                        <div className="h-12 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                    </td>

                    {/* Title */}
                    <td className="p-4 font-medium text-gray-900">
                      {truncate(blog.title, 40)}
                    </td>

                    {/* Content */}
                    <td className="p-4 text-gray-600">
                      {truncate(blog.content, 60)}
                    </td>

                    {/* Contact */}
                    <td className="p-4">
                      <div className="space-y-1">
                        {blog.contactEmail && (
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Mail size={12} />
                            {truncate(blog.contactEmail, 20)}
                          </div>
                        )}
                        {blog.contactPhone && (
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Phone size={12} />
                            {blog.contactPhone}
                          </div>
                        )}
                        {!blog.contactEmail && !blog.contactPhone && (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>

                    {/* Meta Title */}
                    <td className="p-4 text-gray-600">
                      {truncate(blog.metaTitle, 30)}
                    </td>

                    {/* Date */}
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar size={14} />
                        {formatDate(blog.createdDate)}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/blogs/view/${blog.blogId}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          to={`/blogs/edit/${blog.blogId}`}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog.blogId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t">
            <Pagination
              currentPage={page + 1}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTable;
