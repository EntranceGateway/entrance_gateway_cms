import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/common/PageHeader";
import { getTrainingEnrollmentById } from "@/http/trainingEnrollment";
import { useApproveTrainingEnrollment, useRejectTrainingEnrollment, useCancelEnrollmentBySystem } from "@/hooks/useTrainingEnrollment";
import { PulseLoader } from "@/components/loaders";
import ConfirmModal from "@/components/common/ConfirmModal";
import { 
  Calendar, 
  User, 
  GraduationCap, 
  DollarSign, 
  ArrowLeft, 
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Ban,
} from "lucide-react";
import toast from "react-hot-toast";

const ViewTrainingEnrollment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Approve/Reject state
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionError, setRejectionError] = useState("");
  const [showSystemCancelModal, setShowSystemCancelModal] = useState(false);
  
  const approveMutation = useApproveTrainingEnrollment();
  const rejectMutation = useRejectTrainingEnrollment();
  const systemCancelMutation = useCancelEnrollmentBySystem();

  useEffect(() => {
    fetchEnrollment();
  }, [id]);

  const fetchEnrollment = async () => {
    try {
      setLoading(true);
      const res = await getTrainingEnrollmentById(id);
      const data = res.data?.data || res.data;
      setEnrollment(data);
    } catch (err) {
      setError(err.message || "Failed to load enrollment details");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync(parseInt(id));
      toast.success("Enrollment approved successfully!");
      setShowApproveModal(false);
      await fetchEnrollment();
    } catch (err) {
      const errorMessage = err.message || "Failed to approve enrollment";
      toast.error(errorMessage);
      
      // Close modal on certain errors
      if (errorMessage.includes("not found") || errorMessage.includes("already approved")) {
        setShowApproveModal(false);
      }
    }
  };

  const handleReject = async () => {
    setRejectionError("");
    
    if (!rejectionReason.trim()) {
      setRejectionError("Rejection reason is required");
      return;
    }
    
    try {
      await rejectMutation.mutateAsync({
        enrollmentId: parseInt(id),
        reason: rejectionReason.trim(),
      });
      toast.success("Enrollment rejected successfully");
      setShowRejectModal(false);
      setRejectionReason("");
      await fetchEnrollment();
    } catch (err) {
      const errorMessage = err.message || "Failed to reject enrollment";
      
      // Show inline error for validation issues
      if (errorMessage.includes("reason") && errorMessage.includes("required")) {
        setRejectionError(errorMessage);
      } else {
        toast.error(errorMessage);
        
        // Close modal on certain errors
        if (errorMessage.includes("not found") || errorMessage.includes("already rejected")) {
          setShowRejectModal(false);
          setRejectionReason("");
        }
      }
    }
  };

  const handleSystemCancel = async () => {
    try {
      await systemCancelMutation.mutateAsync(parseInt(id));
      toast.success("Enrollment cancelled by system successfully");
      setShowSystemCancelModal(false);
      await fetchEnrollment();
    } catch (err) {
      const errorMessage = err.message || "Failed to cancel enrollment";
      toast.error(errorMessage);
      
      // Close modal on certain errors
      if (errorMessage.includes("not found") || errorMessage.includes("already cancelled")) {
        setShowSystemCancelModal(false);
      }
    }
  };

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
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      ACTIVE: "bg-green-100 text-green-800 border-green-200",
      COMPLETED: "bg-blue-100 text-blue-800 border-blue-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
      PAYMENT_FAILED: "bg-red-100 text-red-800 border-red-200",
      PAYMENT_RECEIVED_ADMIN_APPROVAL_PENDING: "bg-orange-100 text-orange-800 border-orange-200",
      EXPIRED: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${statusColors[status] || "bg-gray-100 text-gray-800"}`}>
        {status?.replace(/_/g, " ")}
      </span>
    );
  };

  const canApprove = enrollment?.status === "PAYMENT_RECEIVED_ADMIN_APPROVAL_PENDING";
  const canSystemCancel = enrollment?.status === "ACTIVE" || enrollment?.status === "PENDING";

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
          <p className="text-sm">{error}</p>
          <button
            onClick={() => navigate("/admin/training-enrollment")}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
          >
            Back to Enrollments
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
            ...(canSystemCancel ? [{
              label: "Cancel by System",
              onClick: () => setShowSystemCancelModal(true),
              icon: <Ban size={18} />,
              variant: "danger",
            }] : []),
            {
              label: "Back",
              onClick: () => navigate("/admin/training-enrollment"),
              icon: <ArrowLeft size={18} />,
              variant: "secondary",
            },
          ]}
        />

        {/* Action Buttons for Pending Approval */}
        {canApprove && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-orange-900 mb-1">Pending Admin Approval</h3>
                <p className="text-sm text-orange-700 mb-4">
                  This enrollment is waiting for admin approval. Review the payment details and approve or reject.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowApproveModal(true)}
                    disabled={approveMutation.isLoading}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle size={18} />
                    {approveMutation.isLoading ? "Approving..." : "Approve Enrollment"}
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={rejectMutation.isLoading}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <XCircle size={18} />
                    {rejectMutation.isLoading ? "Rejecting..." : "Reject Enrollment"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} className="text-indigo-600" />
                User Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-semibold text-gray-900">{enrollment?.userId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold text-gray-900">{enrollment?.userName || "-"}</p>
                </div>
              </div>
            </div>

            {/* Training Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap size={20} className="text-purple-600" />
                Training Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Training Name</p>
                  <p className="font-semibold text-gray-900">{enrollment?.trainingName || "-"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Training ID</p>
                    <p className="font-semibold text-gray-900">{enrollment?.trainingId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Progress</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${enrollment?.progressPercentage || 0}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {enrollment?.progressPercentage || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign size={20} className="text-green-600" />
                Payment Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Amount Paid</p>
                  <p className="font-semibold text-gray-900">Rs {enrollment?.paidAmount?.toLocaleString() || "0"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-semibold text-gray-900">{enrollment?.paymentMethod?.replace(/_/g, " ") || "-"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Payment Reference</p>
                  <p className="font-semibold text-gray-900 font-mono text-sm">{enrollment?.paymentReference || "-"}</p>
                </div>
              </div>
            </div>

            {/* Remarks */}
            {enrollment?.remarks && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-gray-600" />
                  Remarks
                </h3>
                <p className="text-gray-700">{enrollment.remarks}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">Status</h3>
              {getStatusBadge(enrollment?.status)}
            </div>

            {/* Dates Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-4 flex items-center gap-2">
                <Calendar size={16} />
                Important Dates
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Enrollment Date</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(enrollment?.enrollmentDate)}</p>
                </div>
                {enrollment?.completionDate && (
                  <div>
                    <p className="text-xs text-gray-500">Completion Date</p>
                    <p className="text-sm font-semibold text-gray-900">{formatDate(enrollment?.completionDate)}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500">Created At</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(enrollment?.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(enrollment?.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* ID Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-3">Enrollment ID</h3>
              <p className="text-2xl font-bold text-indigo-600">#{enrollment?.enrollmentId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Approve Confirmation Modal */}
      <ConfirmModal
        isOpen={showApproveModal}
        title="Approve Enrollment"
        message={`Are you sure you want to approve this enrollment for ${enrollment?.userName}? This will activate the enrollment and send a confirmation email to the user.`}
        confirmText="Yes, Approve"
        loading={approveMutation.isLoading}
        onConfirm={handleApprove}
        onCancel={() => setShowApproveModal(false)}
      />

      {/* Reject Modal with Reason */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Reject Enrollment</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this enrollment. The user will be notified.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  setRejectionError("");
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none resize-none ${
                  rejectionError ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                rows={4}
                placeholder="e.g., Invalid payment proof, incorrect payment amount..."
              />
              {rejectionError && (
                <p className="mt-1 text-sm text-red-600">{rejectionError}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                  setRejectionError("");
                }}
                disabled={rejectMutation.isLoading}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={rejectMutation.isLoading}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {rejectMutation.isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle size={18} />
                    Reject
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* System Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={showSystemCancelModal}
        title="Cancel Enrollment by System"
        message={
          <div className="space-y-3">
            <p>Are you sure you want to forcefully cancel this enrollment?</p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
              <p className="font-semibold text-amber-900 mb-1">⚠️ Administrative Override</p>
              <ul className="text-amber-800 space-y-1 ml-4 list-disc">
                <li>Bypasses training start date check</li>
                <li>Sets status to CANCELLED</li>
                <li>Decrements training participants</li>
                <li>Adds "Cancelled by system" remark</li>
                <li>Action is logged for audit</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600">
              Use this for policy violations, payment failures, or administrative reasons.
            </p>
          </div>
        }
        confirmText="Yes, Cancel Enrollment"
        loading={systemCancelMutation.isLoading}
        onConfirm={handleSystemCancel}
        onCancel={() => setShowSystemCancelModal(false)}
      />
    </Layout>
  );
};

export default ViewTrainingEnrollment;
