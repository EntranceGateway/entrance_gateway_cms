import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/common/PageHeader";
import { getNoticeById } from "../../http/notice";
import { noticeFile } from "../../http/fetchpdf";
import FileViewer from "@/components/pdf/FileViewer";
import { PulseLoader } from "@/components/loaders";
import { Calendar, Edit, Bell } from "lucide-react";

const ViewNotice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await getNoticeById(id);
        const data = res.data?.data || res.data;
        setNotice(data);
      } catch (err) {
        setError(err.error || "Failed to load notice");
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
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

  if (loading) {
    return (
      <Layout>
        <div className="p-8">
          <PulseLoader lines={8} />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm text-center">
             <h3 className="font-semibold text-lg mb-1">Error Loading Notice</h3>
             <p>{error}</p>
             <button onClick={() => navigate("/notices/all")} className="mt-4 text-sm font-medium underline text-red-800 hover:text-red-900">
                Go back to Notices
             </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="Notice Details"
        subtitle={notice?.title}
        breadcrumbs={[
            { label: "Notices", to: "/notices/all" },
            { label: "View Notice" }
        ]}
        icon={Bell}
        actions={[
            {
                label: "Edit Notice",
                icon: <Edit size={16} />,
                onClick: () => navigate(`/notices/edit/${id}`),
                variant: "secondary"
            }
        ]}
      />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Featured File (Image or PDF or Video) */}
          {notice?.imageName && (
            <div className="w-full bg-gray-50 border-b border-gray-100 min-h-[300px] flex items-center justify-center">
              <FileViewer
                fileUrl={noticeFile(id)}
                fileName={notice.imageName}
                className="w-full h-full object-contain max-h-[600px]"
              />
            </div>
          )}

          <div className="p-8 md:p-10">
            {/* Meta Info */}
            <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm mb-4 bg-indigo-50 w-fit px-3 py-1 rounded-full border border-indigo-100">
               <Calendar size={14} />
               {formatDate(notice?.createdDate)}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {notice?.title}
            </h1>

            {/* Description */}
            {notice?.description ? (
              <div className="prose prose-lg max-w-none text-gray-600 space-y-4 whitespace-pre-wrap leading-relaxed">
                {notice.description}
              </div>
            ) : (
                <p className="text-gray-400 italic">No description provided.</p>
            )}
          </div>
        </article>
      </div>
    </Layout>
  );
};

export default ViewNotice;
