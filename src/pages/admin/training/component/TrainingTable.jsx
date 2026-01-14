import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTrainings, useDeleteTraining } from "@/hooks/useTraining";
import DataTable from "@/components/common/DataTable";
import ConfirmModal from "@/components/common/ConfirmModal";
import PageHeader from "@/components/common/PageHeader";
import { TableSkeleton } from "@/components/loaders";
import { Plus, Edit, Trash2, Calendar, Users, DollarSign, GraduationCap } from "lucide-react";

const TrainingTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState("trainingStatus");
  const [sortOrder, setSortOrder] = useState("asc");
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading, error } = useTrainings({
    page,
    size: pageSize,
    sortBy: sortField,
    sortDir: sortOrder,
  });

  const deleteMutation = useDeleteTraining();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (err) {
      // Error handled by mutation
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
      UPCOMING: "bg-blue-100 text-blue-800",
      FLASH_SALE: "bg-red-100 text-red-800",
      ONGOING: "bg-green-100 text-green-800",
      COMPLETED: "bg-gray-100 text-gray-800",
      CANCELLED: "bg-red-100 text-red-800",
      POSTPONED: "bg-yellow-100 text-yellow-800",
      COMING_SOON: "bg-purple-100 text-purple-800",
      REGISTRATION_OPEN: "bg-green-100 text-green-800",
      REGISTRATION_CLOSED: "bg-orange-100 text-orange-800",
      SOLD_OUT: "bg-red-100 text-red-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const getTypeBadge = (type) => {
    const typeColors = {
      REMOTE: "bg-indigo-100 text-indigo-800",
      ON_SITE: "bg-teal-100 text-teal-800",
      HYBRID: "bg-purple-100 text-purple-800",
    };
    return typeColors[type] || "bg-gray-100 text-gray-800";
  };

  const columns = useMemo(
    () => [
      {
        key: "trainingName",
        label: "Training Name",
        sortable: true,
        render: (row) => (
          <div>
            <div className="font-semibold text-gray-900">{row.trainingName}</div>
            {row.trainingCategory && (
              <div className="text-xs text-gray-500">{row.trainingCategory}</div>
            )}
          </div>
        ),
      },
      {
        key: "trainingType",
        label: "Type",
        render: (row) => (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getTypeBadge(row.trainingType)}`}>
            {row.trainingType?.replace(/_/g, " ")}
          </span>
        ),
      },
      {
        key: "trainingStatus",
        label: "Status",
        sortable: true,
        render: (row) => (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadge(row.trainingStatus)}`}>
            {row.trainingStatus?.replace(/_/g, " ")}
          </span>
        ),
      },
      {
        key: "schedule",
        label: "Schedule",
        render: (row) => (
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Calendar size={12} />
              <span>{formatDate(row.startDate)}</span>
            </div>
            <div className="text-gray-400 pl-4">to {formatDate(row.endDate)}</div>
          </div>
        ),
      },
      {
        key: "participants",
        label: "Participants",
        render: (row) => (
          <div className="flex items-center gap-1.5 text-sm">
            <Users size={14} className="text-gray-400" />
            <span className="font-semibold text-gray-700">
              {row.currentParticipants || 0}/{row.maxParticipants}
            </span>
          </div>
        ),
      },
      {
        key: "price",
        label: "Price",
        sortable: true,
        render: (row) => (
          <div>
            <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
              <DollarSign size={14} />
              <span>{row.price?.toFixed(2)}</span>
            </div>
            {row.offerPercentage > 0 && (
              <div className="text-xs text-green-600">-{row.offerPercentage}% off</div>
            )}
          </div>
        ),
      },
      {
        key: "trainingHours",
        label: "Hours",
        sortable: true,
        render: (row) => <span className="text-sm text-gray-600">{row.trainingHours}h</span>,
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <div className="flex items-center gap-2">
            <Link
              to={`/admin/training/edit/${row.trainingId}`}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Edit Training"
            >
              <Edit size={18} />
            </Link>
            <button
              onClick={() => setDeleteId(row.trainingId)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Training"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl border border-red-100 max-w-2xl mx-auto mt-10">
        <h3 className="text-xl font-bold mb-2">Failed to load trainings</h3>
        <p>{error.message || "An unexpected error occurred."}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <PageHeader
        title="Training Management"
        breadcrumbs={[{ label: "Training" }]}
        icon={GraduationCap}
        actions={[
          {
            label: "Create New Training",
            onClick: () => navigate("/admin/training/add"),
            icon: <Plus size={18} />,
            variant: "primary",
          },
        ]}
      />

      {isLoading ? (
        <TableSkeleton rows={10} columns={8} />
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
        isOpen={!!deleteId}
        title="Delete Training"
        message="Are you sure you want to delete this training? This action cannot be undone."
        confirmText="Delete"
        loading={deleteMutation.isLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default TrainingTable;
