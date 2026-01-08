import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../../../components/layout/Layout";
import { getNoticeById } from "../../http/notice";
import { noticeFile } from "../../http/fetchpdf";
import FileViewer from "../../components/FileViewer/FileViewer";
import Spinner from "../../../components/Spinner/Spinner";
import { ArrowLeft, Calendar, Edit } from "lucide-react";

const ViewNotice = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await getNoticeById(id, token);
        setNotice(res.data.data);
      } catch (err) {
        setError(err.error || "Failed to load notice");
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id, token]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
            to="/notices/all"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Notices
          </Link>
          <Link
            to={`/notices/edit/${id}`}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200"
          >
            <Edit size={18} />
            Edit Notice
          </Link>
        </div>

        {/* Notice Content */}
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Featured File (Image or PDF or Video) */}
          {notice?.imageName && (
            <div className="w-full bg-gray-100 border-b border-gray-200">
              <FileViewer 
                fileUrl={noticeFile(id)}
                token={token}
                fileName={notice.imageName}
                className="w-full"
              />
            </div>
          )}

          <div className="p-8">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {notice?.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-6 pb-6 border-b">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                {formatDate(notice?.createdDate)}
              </div>
            </div>

            {/* Description */}
            {notice?.description && (
              <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
                {notice.description}
              </div>
            )}
          </div>
        </article>
      </div>
    </Layout>
  );
};

export default ViewNotice;
