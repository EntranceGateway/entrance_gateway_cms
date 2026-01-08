import { useEffect, useState } from "react";

import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { getBlogById, downloadBlogFile, getBlogFileUrl } from "../../http/blog";
import Spinner from "@/components/common/Spinner";
import { ArrowLeft, Calendar, Mail, Phone, Tag, Hash, Edit, Download, ExternalLink } from "lucide-react";

const ViewBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogById(id);
        setBlog(res.data.data);
      } catch (err) {
        setError(err.error || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle file download
  const handleDownload = async () => {
    try {
      const response = await downloadBlogFile(id);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = blog?.imageName || `blog_${id}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download file");
    }
  };

  // Open file in new tab
  const handleOpenInNewTab = () => {
    window.open(getBlogFileUrl(id), "_blank");
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Back Button & Actions */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/blogs"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Blogs
          </Link>
          <Link
            to={`/blogs/edit/${id}`}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200"
          >
            <Edit size={18} />
            Edit Blog
          </Link>
        </div>

        {/* Blog Content */}
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Featured Image */}
          {blog?.imageName && (
            <div className="relative">
              <div className="w-full h-64 md:h-80">
                <img
                  src={getBlogFileUrl(id)}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Image Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={handleOpenInNewTab}
                  className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-lg shadow-md transition-all duration-200 flex items-center gap-1"
                  title="Open in new tab"
                >
                  <ExternalLink size={18} />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-lg shadow-md transition-all duration-200 flex items-center gap-1"
                  title="Download"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>
          )}

          <div className="p-8">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {blog?.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-6 pb-6 border-b">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                {formatDate(blog?.createdDate)}
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
              {blog?.content}
            </div>

            {/* Contact Info */}
            {(blog?.contactEmail || blog?.contactPhone) && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                <div className="flex flex-wrap gap-6">
                  {blog?.contactEmail && (
                    <a
                      href={`mailto:${blog.contactEmail}`}
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
                    >
                      <Mail size={18} />
                      {blog.contactEmail}
                    </a>
                  )}
                  {blog?.contactPhone && (
                    <a
                      href={`tel:${blog.contactPhone}`}
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
                    >
                      <Phone size={18} />
                      {blog.contactPhone}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* SEO Info */}
            {(blog?.metaTitle || blog?.metaDescription || blog?.keywords) && (
              <div className="mt-8 pt-6 border-t bg-gray-50 -mx-8 -mb-8 p-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">SEO Information</h3>
                <div className="space-y-3">
                  {blog?.metaTitle && (
                    <div>
                      <span className="flex items-center gap-1 text-sm font-medium text-gray-600">
                        <Tag size={14} /> Meta Title
                      </span>
                      <p className="text-gray-800">{blog.metaTitle}</p>
                    </div>
                  )}
                  {blog?.metaDescription && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">Meta Description</span>
                      <p className="text-gray-800">{blog.metaDescription}</p>
                    </div>
                  )}
                  {blog?.keywords && (
                    <div>
                      <span className="flex items-center gap-1 text-sm font-medium text-gray-600">
                        <Hash size={14} /> Keywords
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {blog.keywords.split(",").map((keyword, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                          >
                            {keyword.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </Layout>
  );
};

export default ViewBlog;
