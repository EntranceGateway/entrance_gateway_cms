import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useTrainingEnrollments,
  useCancelTrainingEnrollment,
  useUpdateEnrollmentProgress,
} from "@/hooks/useTrainingEnrollment";
import DataTable from "@/components/common/DataTable";
import ConfirmModal from "@/components/common/ConfirmModal";
import PageHeader from "@/components/common/PageHeader";
import { TableSkeleton } from "@/components/loaders";
import { Users, Trash2, Calendar, DollarSign, TrendingUp, CreditCard } from "lucide-react";
import { toast } from "react-hot-toast";

const TrainingEnrollmentTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState("enrollmentDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [cancelId, setCancelId] = useState(null);
  const [progressModal, setProgressModal] = useState({ open: false, id: null, current: 0 });

  const { data, isLoading, error } = useTrainingEnrollments({
    page,
    size: pageSize,
    sortBy: sortField,
    sortDir: sortOrder,
  });

  const cancelMutation = useCancelTrainingEnrollment();
  const updateProgressMutation = useUpdateEnrollmentProgress();

  const handleCancel = async () => {
    if (!cancelId) return;
    try {
      await cancelMutation.mutateAsync(cancelId);
      toast.success("Enrollment cancelled successfully");
      setCancelId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel enrollment");
    }
  };

  const handleUpdateProgress = async () => {
    if (!progressModal.id) return;
    try {
      await updateProgressMutation.mutateAsync({
        id: progressModal.id,
        progressPercentage: progressModal.current,
      });
      toast.success("Progress updated successfully");
      setProgressModal({ open: false, id: null, current: 0 });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update progress");
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
            {(row.status === "ACTIVE" || row.status === "PENDING") && (
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
                  onChange={(e) =>
                    setProgressModal({ ...progressModal, current: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
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
    </div>
  );
};

export default TrainingEnrollmentTable;
