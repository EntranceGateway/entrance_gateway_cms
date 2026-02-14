import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useTrainingEnrollments,
  useCancelTrainingEnrollment,
  useUpdateEnrollmentProgress,
  useApproveTrainingEnrollment,
  useRejectTrainingEnrollment,
  useCancelEnrollmentBySystem,
} from "@/hooks/useTrainingEnrollment";
import DataTable from "@/components/common/DataTable";
import ConfirmModal from "@/components/common/ConfirmModal";
import PageHeader from "@/components/common/PageHeader";
import { TableSkeleton } from "@/components/loaders";
import { Users, Trash2, Calendar, DollarSign, TrendingUp, CreditCard, CheckCircle, XCircle, Ban } from "lucide-react";
import { toast } from "react-hot-toast";

const TrainingEnrollmentTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState("enrollmentDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [cancelId, setCancelId] = useState(null);
  const [progressModal, setProgressModal] = useState({ open: false, id: null, current: 0 });
  const [approveId, setApproveId] = useState(null);
  const [rejectModal, setRejectModal] = useState({ open: false, id: null, reason: "" });
  const [systemCancelId, setSystemCancelId] = useState(null);

  const { data, isLoading, error } = useTrainingEnrollments({
    page,
    size: pageSize,
    sortBy: sortField,
    sortDir: sortOrder,
  });

  const cancelMutation = useCancelTrainingEnrollment();
  const updateProgressMutation = useUpdateEnrollmentProgress();
  const approveMutation = useApproveTrainingEnrollment();
  const rejectMutation = useRejectTrainingEnrollment();
  const systemCancelMutation = useCancelEnrollmentBySystem();

  const handleCancel = async () => {
    if (!cancelId) return;
    try {
      await cancelMutation.mutateAsync(cancelId);
      toast.success("Enrollment cancelled successfully");
      setCancelId(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to cancel enrollment";
      toast.error(errorMessage);
      
      // Close modal on certain errors
      if (errorMessage.includes("not found") || errorMessage.includes("already cancelled")) {
        setCancelId(null);
      }
    }
  };

  const handleUpdateProgress = async () => {
    if (!progressModal.id) return;
    
    // Validate progress percentage
    if (progressModal.current < 0 || progressModal.current > 100) {
      toast.error("Progress must be between 0 and 100");
      return;
    }
    
    try {
      await updateProgressMutation.mutateAsync({
        id: progressModal.id,
        progressPercentage: progressModal.current,
      });
      toast.success("Progress updated successfully");
      setProgressModal({ open: false, id: null, current: 0 });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update progress";
      toast.error(errorMessage);
      
      // Close modal on certain errors
      if (errorMessage.includes("not found")) {
        setProgressModal({ open: false, id: null, current: 0 });
      }
    }
  };

  const handleApprove = async () => {
    if (!approveId) return;
    try {
      await approveMutation.mutateAsync(approveId);
      toast.success("Enrollment approved successfully!");
      setApproveId(null);
    } catch (err) {
      const errorMessage = err.message || "Failed to approve enrollment";
      toast.error(errorMessage);
      
      // Close modal on certain errors
      if (errorMessage.includes("not found") || errorMessage.includes("already approved")) {
        setApproveId(null);
      }
    }
  };

  const handleReject = async () => {
    if (!rejectModal.id || !rejectModal.reason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }
    try {
      await rejectMutation.mutateAsync({
        enrollmentId: rejectModal.id,
        reason: rejectModal.reason.trim(),
      });
      toast.success("Enrollment rejected successfully");
      setRejectModal({ open: false, id: null, reason: "" });
    } catch (err) {
      const errorMessage = err.message || "Failed to reject enrollment";
      toast.error(errorMessage);
      
      // Close modal on certain errors
      if (errorMessage.includes("not found") || errorMessage.includes("already rejected")) {
        setRejectModal({ open: false, id: null, reason: "" });
      }
    }
  };

  const handleSystemCancel = async () => {
    if (!systemCancelId) return;
    try {
      await systemCancelMutation.mutateAsync(systemCancelId);
      toast.success("Enrollment cancelled by system successfully");
      setSystemCancelId(null);
    } catch (err) {
      const errorMessage = err.message || "Failed to cancel enrollment";
      toast.error(errorMessage);
      
      // Close modal on certain errors
      if (errorMessage.includes("not found") || errorMessage.includes("already cancelled")) {
        setSystemCancelId(null);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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
      PAYMENT_RECEIVED_ADMIN_APPROVAL_PENDING: "bg-orange-100 text-orange-800",
      EXPIRED: "bg-gray-100 text-gray-800",
      SUSPENDED: "bg-orange-100 text-orange-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const columns = useMemo(
    () => [
      {
        key: "enrollmentId",
        label: "ID",
        sortable: true,
        render: (row) => <span className="font-semibold text-gray-700">#{row.enrollmentId}</span>,
      },
      {
        key: "userName",
        label: "User",
        sortable: true,
        render: (row) => (
          <div>
            <div className="font-semibold text-gray-900">{row.userName}</div>
            <div className="text-xs text-gray-500">ID: {row.userId}</div>
          </div>
        ),
      },
      {
        key: "trainingName",
        label: "Training",
        render: (row) => (
          <div>
            <div className="font-semibold text-gray-900">{row.trainingName}</div>
            <div className="text-xs text-gray-500">ID: {row.trainingId}</div>
          </div>
        ),
      },
      {
        key: "status",
        label: "Status",
        sortable: true,
        render: (row) => (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadge(row.status)}`}>
            {row.status?.replace(/_/g, " ")}
          </span>
        ),
      },
      {
        key: "enrollmentDate",
        label: "Enrollment Date",
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Calendar size={14} />
            <span>{formatDate(row.enrollmentDate)}</span>
          </div>
        ),
      },
      {
        key: "completionDate",
        label: "Completion",
        render: (row) => (
          <div className="text-sm text-gray-600">
            {row.completionDate ? formatDate(row.completionDate) : "-"}
          </div>
        ),
      },
      {
        key: "payment",
        label: "Payment",
        render: (row) => (
          <div>
            <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
              <DollarSign size={14} />
              <span>{row.paidAmount?.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <CreditCard size={12} />
              <span>{row.paymentMethod}</span>
            </div>
            {row.paymentReference && (
              <div className="text-xs text-gray-400">{row.paymentReference}</div>
            )}
          </div>
        ),
      },
      {
        key: "progressPercentage",
        label: "Progress",
        sortable: true,
        render: (row) => (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all"
                  style={{ width: `${row.progressPercentage || 0}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-700 w-10">
                {row.progressPercentage || 0}%
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setProgressModal({
                  open: true,
                  id: row.enrollmentId,
                  current: row.progressPercentage || 0,
                });
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <TrendingUp size={12} />
              Update
            </button>
          </div>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <div className="flex items-center gap-2">
            {row.status === "PAYMENT_RECEIVED_ADMIN_APPROVAL_PENDING" && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setApproveId(row.enrollmentId);
                  }}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Approve Enrollment"
                >
                  <CheckCircle size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRejectModal({ open: true, id: row.enrollmentId, reason: "" });
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Reject Enrollment"
                >
                  <XCircle size={18} />
                </button>
              </>
            )}
            {(row.status === "ACTIVE" || row.status === "PENDING") && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSystemCancelId(row.enrollmentId);
                  }}
                  className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  title="Cancel by System (Admin)"
                >
                  <Ban size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCancelId(row.enrollmentId);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Cancel Enrollment"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>
        ),
      },
    ],
    []
  );

  if (error) {
    return (
      <div className="animate-in fade-in duration-500">
        <PageHeader
          title="Training Enrollment Management"
          breadcrumbs={[{ label: "Training Enrollments" }]}
          icon={Users}
        />
        <div className="p-8 text-center text-amber-600 bg-amber-50 rounded-2xl border border-amber-200 max-w-2xl mx-auto mt-10">
          <h3 className="text-xl font-bold mb-2">⚠️ Backend API Not Available</h3>
          <p className="mb-4">
            The training enrollment API endpoint is not yet implemented on the backend server.
          </p>
          <div className="text-sm text-left bg-white p-4 rounded-lg border border-amber-200 mb-4">
            <p className="font-semibold mb-2">Expected Endpoint:</p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              GET /api/v1/training-enrollments?page=0&size=10&sortBy=enrollmentDate&sortDir=desc
            </code>
            <p className="mt-3 font-semibold mb-2">Error:</p>
            <code className="text-xs text-red-600">{error.message || "API Error"}</code>
          </div>
          <p className="text-sm text-gray-600">
            The frontend implementation is complete. Please implement the backend API endpoints as documented.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="Training Enrollment Management"
        breadcrumbs={[{ label: "Training Enrollments" }]}
        icon={Users}
      />

      {isLoading ? (
        <TableSkeleton rows={10} columns={9} />
      ) : (
        <DataTable
          data={data?.content || []}
          columns={columns}
          loading={isLoading}
          onRowClick={(row) => navigate(`/admin/training-enrollment/view/${row.enrollmentId}`)}
          pagination={{
            currentPage: page,
            totalPages: data?.totalPages || 0,
            totalItems: data?.totalElements || 0,
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
        isOpen={!!cancelId}
        title="Cancel Enrollment"
        message="Are you sure you want to cancel this enrollment? This action cannot be undone."
        confirmText="Cancel Enrollment"
        loading={cancelMutation.isLoading}
        onConfirm={handleCancel}
        onCancel={() => setCancelId(null)}
      />

      <ConfirmModal
        isOpen={!!approveId}
        title="Approve Enrollment"
        message="Are you sure you want to approve this enrollment? This will activate the enrollment and send a confirmation email to the user."
        confirmText="Yes, Approve"
        loading={approveMutation.isLoading}
        onConfirm={handleApprove}
        onCancel={() => setApproveId(null)}
      />

      <ConfirmModal
        isOpen={!!systemCancelId}
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
        onCancel={() => setSystemCancelId(null)}
      />

      {/* Progress Update Modal */}
      {progressModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Update Progress</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progress Percentage (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={progressModal.current}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    const clampedValue = Math.min(100, Math.max(0, value));
                    setProgressModal({ ...progressModal, current: clampedValue });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter 0-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Current: {progressModal.current}%
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setProgressModal({ open: false, id: null, current: 0 })}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
                  disabled={updateProgressMutation.isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProgress}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
                  disabled={updateProgressMutation.isLoading}
                >
                  {updateProgressMutation.isLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal with Reason */}
      {rejectModal.open && (
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
                value={rejectModal.reason}
                onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none resize-none"
                rows={4}
                placeholder="e.g., Invalid payment proof, incorrect payment amount..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setRejectModal({ open: false, id: null, reason: "" })}
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
    </div>
  );
};

export default TrainingEnrollmentTable;
