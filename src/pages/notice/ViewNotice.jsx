import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../../../components/layout/Layout";
import { getNoticeById, downloadNoticeFile, getNoticeFileUrl } from "../../http/notice";
import { getSingle, noticeFile } from "../../http/fetchpdf";
import PdfViewer from "../../components/pdfview/PdfViewer";
import Spinner from "../../../components/Spinner/Spinner";
import { ArrowLeft, Calendar, Edit, Download, ExternalLink, FileText } from "lucide-react";

// Helper to check if file is PDF
const isPdfFile = (filename) => {
  if (!filename) return false;
  return filename.toLowerCase().endsWith(".pdf");
};

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

  // Handle file download
  const handleDownload = async () => {
    try {
      const response = await downloadNoticeFile(id, token);
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = notice?.imageName || `notice_${id}`;
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
    window.open(getNoticeFileUrl(id), "_blank");
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
          {/* Featured File (Image or PDF) */}
          {notice?.imageName && (
            <div className="relative">
              {isPdfFile(notice.imageName) ? (
                // PDF Display using PdfViewer component
                <div className="w-full bg-gray-100 p-6">
                  <div className="flex flex-col items-center justify-center py-4">
                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={handleOpenInNewTab}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                      >
                        <ExternalLink size={18} />
                        Open in New Tab
                      </button>
                      <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                      >
                        <Download size={18} />
                        Download
                      </button>
                    </div>
                  </div>
                  {/* Embedded PDF Viewer using PdfViewer component */}
                  <div className="w-full h-[600px]">
                    <PdfViewer
                      noteId={id}
                      token={token}
                      fetchPdfBlob={getSingle}
                      suburl={noticeFile}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              ) : (
                // Image Display
                <>
                  <div className="w-full h-64 md:h-80">
                    <img
                      src={getNoticeFileUrl(id)}
                      alt={notice.title}
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
                </>
              )}
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
