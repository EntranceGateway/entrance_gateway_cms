import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/common/PageHeader";
import { getTrainingEnrollmentById } from "@/http/trainingEnrollment";
import { PulseLoader } from "@/components/loaders";
import { Calendar, User, GraduationCap, DollarSign, CreditCard, TrendingUp, ArrowLeft, FileText } from "lucide-react";

const ViewTrainingEnrollment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const res = await getTrainingEnrollmentById(id);
        const data = res.data?.data || res.data;
        setEnrollment(data);
      } catch (err) {
        setError(err.error || "Failed to load enrollment details");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollment();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      ACTIVE: "bg-green-100 text-green-800",
      COMPLETED: "bg-blue-100 text-blue-800",
      CANCELLED: "bg-red-100 text-red-800",
      PAYMENT_FAILED: "bg-red-100 text-red-800",
      EXPIRED: "bg-gray-100 text-gray-800",
      SUSPENDED: "bg-orange-100 text-orange-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <PulseLoader />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl border border-red-100 max-w-2xl mx-auto mt-10">
          <h3 className="font-semibold text-lg mb-1">Error Loading Enrollment</h3>
          <p>{error}</p>
          <button
            onClick={() => navigate("/admin/training-enrollment")}
            className="mt-4 text-sm font-medium underline text-red-800 hover:text-red-900"
          >
            Go back to Training Enrollments
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-in fade-in duration-500">
        <PageHeader
          title="Training Enrollment Details"
          subtitle={enrollment?.userName}
          breadcrumbs={[
            { label: "Training Enrollments", to: "/admin/training-enrollment" },
            { label: "View Details" },
          ]}
          icon={GraduationCap}
          actions={[
            {
              label: "Back",
              icon: <ArrowLeft size={16} />,
              onClick: () => navigate("/admin/training-enrollment"),
              variant: "secondary",
            },
          ]}
        />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Status Badge */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Enrollment #{enrollment?.enrollmentId}
                </h2>
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getStatusBadge(
                    enrollment?.status
                  )}`}
                >
                  {enrollment?.status?.replace(/_/g, " ")}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Progress</div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-green-500 h-full transition-all"
                      style={{ width: `${enrollment?.progressPercentage || 0}%` }}
                    />
                  </div>
                  <span className="text-xl font-bold text-gray-900">
                    {enrollment?.progressPercentage || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8 space-y-8">
            {/* User Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-indigo-600" />
                User Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-xl p-6">
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    User Name
                  </label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {enrollment?.userName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    User ID
                  </label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {enrollment?.userId}
                  </p>
                </div>
              </div>
            </div>

            {/* Training Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap size={20} className="text-indigo-600" />
                Training Program
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-xl p-6">
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Training Name
                  </label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {enrollment?.trainingName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Training ID
                  </label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {enrollment?.trainingId}
                  </p>
                </div>
              </div>
            </div>

            {/* Enrollment Timeline */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-indigo-600" />
                Timeline
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-xl p-6">
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Enrollment Date
                  </label>
                  <p className="text-lg text-gray-900 mt-1">
                    {formatDate(enrollment?.enrollmentDate)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Completion Date
                  </label>
                  <p className="text-lg text-gray-900 mt-1">
                    {formatDate(enrollment?.completionDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign size={20} className="text-indigo-600" />
                Payment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 rounded-xl p-6">
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Amount Paid
                  </label>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${enrollment?.paidAmount?.toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <CreditCard size={14} /> Payment Method
                  </label>
                  <p className="text-lg text-gray-900 mt-1">
                    {enrollment?.paymentMethod || "-"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Payment Reference
                  </label>
                  <p className="text-sm text-gray-900 mt-1 font-mono">
                    {enrollment?.paymentReference || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-indigo-600" />
                Progress Tracking
              </h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Course Completion
                  </label>
                  <span className="text-3xl font-bold text-gray-900">
                    {enrollment?.progressPercentage || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-500"
                    style={{ width: `${enrollment?.progressPercentage || 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            {enrollment?.remarks && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-indigo-600" />
                  Remarks
                </h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-900 whitespace-pre-wrap">{enrollment.remarks}</p>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-semibold">Created:</span> {formatDate(enrollment?.createdAt)}
                </div>
                <div>
                  <span className="font-semibold">Last Updated:</span>{" "}
                  {formatDate(enrollment?.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewTrainingEnrollment;
