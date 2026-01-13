import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/common/PageHeader";
import { getBlogById, downloadBlogFile, getBlogFileUrl } from "../../http/blog";
import { PulseLoader } from "@/components/loaders";
import { Calendar, Mail, Phone, Tag, Hash, Edit, Download, ExternalLink, BookOpen } from "lucide-react";

const ViewBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogById(id);
        const data = res.data?.data || res.data;
        setBlog(data);
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
        <div className="p-8">
          <PulseLoader lines={10} />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm text-center">
             <h3 className="font-semibold text-lg mb-1">Error Loading Blog</h3>
             <p>{error}</p>
             <button onClick={() => navigate("/blogs")} className="mt-4 text-sm font-medium underline text-red-800 hover:text-red-900">
                Go back to Blogs
             </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="Blog Post Details"
        subtitle={blog?.title}
        breadcrumbs={[
            { label: "Blogs", to: "/blogs" },
            { label: "View Blog" }
        ]}
        icon={BookOpen}
        actions={[
            {
                label: "Edit Post",
                icon: <Edit size={16} />,
                onClick: () => navigate(`/blogs/edit/${id}`),
                variant: "secondary"
            }
        ]}
      />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Featured Image */}
          {blog?.imageName && (
            <div className="relative group">
              <div className="w-full h-[400px] bg-gray-50">
                <img
                  src={getBlogFileUrl(id)}
                  alt={blog.title}
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Image Actions Overlay */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={handleOpenInNewTab}
                  className="p-2.5 bg-white text-gray-700 rounded-xl shadow-lg hover:bg-gray-50 transition-all active:scale-95"
                  title="Open in new tab"
                >
                  <ExternalLink size={18} />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2.5 bg-white text-gray-700 rounded-xl shadow-lg hover:bg-gray-50 transition-all active:scale-95"
                  title="Download"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>
          )}

          <div className="p-8 md:p-12">
            
            {/* Meta Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    <Calendar size={14} />
                    {formatDate(blog?.createdDate)}
                </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              {blog?.title}
            </h1>

            {/* Content */}
            <div className="prose prose-lg max-w-none text-gray-600 space-y-6 whitespace-pre-wrap leading-relaxed border-b border-gray-100 pb-10 mb-10">
              {blog?.content}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Info */}
                {(blog?.contactEmail || blog?.contactPhone) && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        Contact Information
                    </h3>
                    <div className="space-y-3">
                      {blog?.contactEmail && (
                        <a
                          href={`mailto:${blog.contactEmail}`}
                          className="flex items-center gap-3 text-gray-600 hover:text-indigo-600 transition-colors p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100"
                        >
                          <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                             <Mail size={16} />
                          </div>
                          {blog.contactEmail}
                        </a>
                      )}
                      {blog?.contactPhone && (
                        <a
                          href={`tel:${blog.contactPhone}`}
                          className="flex items-center gap-3 text-gray-600 hover:text-indigo-600 transition-colors p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100"
                        >
                          <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                             <Phone size={16} />
                          </div>
                          {blog.contactPhone}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* SEO Info */}
                {(blog?.metaTitle || blog?.metaDescription || blog?.keywords) && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        SEO Metadata
                    </h3>
                    <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-100">
                      {blog?.metaTitle && (
                        <div>
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1">
                            <Tag size={12} /> Meta Title
                          </span>
                          <p className="text-gray-900 text-sm font-medium leading-relaxed">{blog.metaTitle}</p>
                        </div>
                      )}
                      {blog?.metaDescription && (
                        <div>
                          <span className="text-xs font-semibold text-gray-500 mb-1 block">Meta Description</span>
                          <p className="text-gray-600 text-sm leading-relaxed">{blog.metaDescription}</p>
                        </div>
                      )}
                      {blog?.keywords && (
                        <div>
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
                            <Hash size={12} /> Keywords
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {blog.keywords.split(",").map((keyword, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 bg-white text-gray-600 rounded-md text-xs font-medium border border-gray-200 shadow-sm"
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
          </div>
        </article>
      </div>
    </Layout>
  );
};

export default ViewBlog;
