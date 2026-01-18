import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAdmissions,
  useWithdrawAdmission,
  useUpdateAdmissionStatus,
} from "@/hooks/useAdmission";
import DataTable from "@/components/common/DataTable";
import ConfirmModal from "@/components/common/ConfirmModal";
import PageHeader from "@/components/common/PageHeader";
import { TableSkeleton } from "@/components/loaders";
import { GraduationCap, Trash2, Calendar, Edit2, Phone, Mail, Eye } from "lucide-react";
import { toast } from "react-hot-toast";

const AdmissionTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState("appliedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [withdrawId, setWithdrawId] = useState(null);
  const [statusModal, setStatusModal] = useState({ open: false, id: null, currentStatus: "", remarks: "" });

  const { data, isLoading, error } = useAdmissions({
    page,
    size: pageSize,
    sortBy: sortField,
    sortDir: sortOrder,
  });

  const withdrawMutation = useWithdrawAdmission();
  const updateStatusMutation = useUpdateAdmissionStatus();

  const handleWithdraw = async () => {
    if (!withdrawId) return;
    try {
      await withdrawMutation.mutateAsync(withdrawId);
      toast.success("Admission withdrawn successfully");
      setWithdrawId(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to withdraw admission");
    }
  };

  const handleUpdateStatus = async () => {
    if (!statusModal.id || !statusModal.currentStatus) return;
    try {
      await updateStatusMutation.mutateAsync({
        id: statusModal.id,
        status: statusModal.currentStatus,
        remarks: statusModal.remarks,
      });
      toast.success("Status updated successfully");
      setStatusModal({ open: false, id: null, currentStatus: "", remarks: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      APPLIED: "bg-blue-100 text-blue-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      ENROLLED: "bg-indigo-100 text-indigo-800",
      REJECTED: "bg-red-100 text-red-800",
      WITHDRAWN: "bg-gray-100 text-gray-800",
      ON_CONTACT: "bg-purple-100 text-purple-800",
      OUT_OF_CONTACT: "bg-orange-100 text-orange-800",
      UNDER_REVIEW: "bg-cyan-100 text-cyan-800",
      DOCUMENTS_PENDING: "bg-amber-100 text-amber-800",
      INTERVIEW_SCHEDULED: "bg-teal-100 text-teal-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const statusOptions = [
    "APPLIED",
    "PENDING",
    "APPROVED",
    "ENROLLED",
    "REJECTED",
    "WITHDRAWN",
    "ON_CONTACT",
    "OUT_OF_CONTACT",
    "UNDER_REVIEW",
    "DOCUMENTS_PENDING",
    "INTERVIEW_SCHEDULED",
  ];

  const columns = useMemo(
    () => [
      {
        key: "admissionId",
        label: "ID",
        sortable: true,
        render: (row) => <span className="font-semibold text-gray-700">#{row.admissionId}</span>,
      },
      {
        key: "applicantName",
        label: "Applicant",
        sortable: true,
        render: (row) => (
          <div>
            <div className="font-semibold text-gray-900">{row.applicantName}</div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Mail size={10} />
              {row.applicantEmail}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Phone size={10} />
              {row.applicantPhone}
            </div>
          </div>
        ),
      },
      {
        key: "courseName",
        label: "Course",
        render: (row) => (
          <div>
            <div className="font-semibold text-gray-900">{row.courseName}</div>
            <div className="text-xs text-gray-500">{row.collegeName}</div>
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
        key: "appliedAt",
        label: "Applied",
        sortable: true,
        render: (row) => (
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Calendar size={14} />
            <span>{formatDate(row.applicationDate)}</span>
          </div>
        ),
      },
      {
        key: "approvalDate",
        label: "Approved",
        render: (row) => (
          <div className="text-sm text-gray-600">{formatDate(row.approvalDate)}</div>
        ),
      },
      {
        key: "previousEducation",
        label: "Education",
        render: (row) => (
          <div className="text-xs text-gray-600 max-w-xs truncate" title={row.previousEducation}>
            {row.previousEducation || "-"}
          </div>
        ),
      },
      {
        key: "referredBy",
        label: "Referred By",
        render: (row) => (
          <div className="text-sm text-gray-600">{row.referredBy || "-"}</div>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/admin/admission/view/${row.admissionId}`)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() =>
                setStatusModal({
                  open: true,
                  id: row.admissionId,
                  currentStatus: row.status,
                  remarks: row.remarks || "",
                })
              }
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Update Status"
            >
              <Edit2 size={18} />
            </button>
            {(row.status === "PENDING" || row.status === "UNDER_REVIEW") && (
              <button
                onClick={() => setWithdrawId(row.admissionId)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Withdraw Application"
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
          title="Admission Management"
          breadcrumbs={[{ label: "Admissions" }]}
          icon={GraduationCap}
        />
        <div className="p-8 text-center text-amber-600 bg-amber-50 rounded-2xl border border-amber-200 max-w-2xl mx-auto mt-10">
          <h3 className="text-xl font-bold mb-2">⚠️ Backend API Not Available</h3>
          <p className="mb-4">
            The admission API endpoint is not yet implemented on the backend server.
          </p>
          <div className="text-sm text-left bg-white p-4 rounded-lg border border-amber-200 mb-4">
            <p className="font-semibold mb-2">Expected Endpoint:</p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              GET /api/v1/admissions?page=0&size=10&sortBy=appliedAt&sortDir=desc
            </code>
            <p className="mt-3 font-semibold mb-2">Error:</p>
            <code className="text-xs text-red-600">{error.message || "400 Bad Request"}</code>
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
        title="Admission Management"
        breadcrumbs={[{ label: "Admissions" }]}
        icon={GraduationCap}
      />

      {isLoading ? (
        <TableSkeleton rows={10} columns={9} />
      ) : (
        <DataTable
          data={data?.content || []}
          columns={columns}
          loading={isLoading}
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
        isOpen={!!withdrawId}
        title="Withdraw Application"
        message="Are you sure you want to withdraw this admission application? This action cannot be undone."
        confirmText="Withdraw"
        loading={withdrawMutation.isLoading}
        onConfirm={handleWithdraw}
        onCancel={() => setWithdrawId(null)}
      />

      {/* Status Update Modal */}
      {statusModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Update Admission Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusModal.currentStatus}
                  onChange={(e) =>
                    setStatusModal({ ...statusModal, currentStatus: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  value={statusModal.remarks}
                  onChange={(e) => setStatusModal({ ...statusModal, remarks: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Add any notes or remarks..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setStatusModal({ open: false, id: null, currentStatus: "", remarks: "" })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition"
                  disabled={updateStatusMutation.isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
                  disabled={updateStatusMutation.isLoading}
                >
                  {updateStatusMutation.isLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionTable;
