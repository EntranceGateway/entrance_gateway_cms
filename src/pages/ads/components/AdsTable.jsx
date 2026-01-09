import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAds, useDeleteAd } from "@/hooks/useAds";
import { AD_POSITIONS, AD_STATUSES, AD_PRIORITIES } from "@/constants/ads.constants";
import DataTable from "@/components/common/DataTable";
import ConfirmModal from "@/components/common/ConfirmModal";
import PageHeader from "@/components/common/PageHeader";
import LoadingState from "@/components/common/LoadingState";
import { Plus, Edit, Trash2, Calendar, Image as ImageIcon, DollarSign } from "lucide-react";

const AdsTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch Ads using hook
  const { data, isLoading, error } = useAds({ page, size: pageSize });
  const deleteMutation = useDeleteAd();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (err) {
      console.error("Delete Ad Error:", err);
    }
  };

  // Helper logic
  const getLabel = (options, value) => options.find((o) => o.value === value)?.label || value || "-";

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getBadgeStyle = (type, value) => {
    const statusColors = {
      ACTIVE: "bg-green-100 text-green-800",
      DRAFT: "bg-gray-100 text-gray-800",
      PAUSED: "bg-yellow-100 text-yellow-800",
      EXPIRED: "bg-red-100 text-red-800",
    };
    const priorityColors = {
      HIGH: "bg-red-100 text-red-800",
      MEDIUM: "bg-yellow-100 text-yellow-800",
      LOW: "bg-blue-100 text-blue-800",
    };
    return type === "status" ? statusColors[value] : priorityColors[value];
  };

  const columns = useMemo(
    () => [
      {
        key: "image",
        label: "Image",
        render: (row) =>
          row.images?.[0] ? (
            <img
              src={`https://api.entrancegateway.com/images/${row.images[0]}`}
              alt={row.title}
              className="h-10 w-14 object-cover rounded-lg border border-gray-100"
            />
          ) : (
            <div className="h-10 w-14 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
              <ImageIcon size={18} className="text-gray-300" />
            </div>
          ),
      },
      {
        key: "title",
        label: "Title & Banner",
        render: (row) => (
          <div>
            <div className="font-semibold text-gray-900">{row.title || "-"}</div>
            <div className="text-xs text-gray-500 italic">{row.banner}</div>
          </div>
        ),
      },
      {
        key: "position",
        label: "Position",
        render: (row) => getLabel(AD_POSITIONS, row.position),
      },
      {
        key: "status",
        label: "Status",
        render: (row) => (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getBadgeStyle("status", row.status)}`}>
            {getLabel(AD_STATUSES, row.status)}
          </span>
        ),
      },
      {
        key: "priority",
        label: "Priority",
        render: (row) => (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getBadgeStyle("priority", row.priority)}`}>
            {getLabel(AD_PRIORITIES, row.priority)}
          </span>
        ),
      },
      {
        key: "duration",
        label: "Duration",
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
        key: "budget",
        label: "Budget",
        render: (row) =>
          row.totalBudget ? (
            <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
              <DollarSign size={14} />
              <span>{row.totalBudget.toFixed(2)}</span>
            </div>
          ) : (
            <span className="text-gray-400">-</span>
          ),
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <div className="flex items-center gap-2">
            <Link
              to={`/ads/edit/${row.adId}`}
              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
              title="Edit Ad"
            >
              <Edit size={18} />
            </Link>
            <button
              onClick={() => setDeleteId(row.adId)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
              title="Delete Ad"
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
        <h3 className="text-xl font-bold mb-2">Failed to load advertisements</h3>
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Ads Management"
        breadcrumbs={[{ label: "Ads" }]}
        actions={[
          {
            label: "Create Advertisement",
            onClick: () => navigate("/ads/add"),
            icon: <Plus size={18} />,
            variant: "primary",
          },
        ]}
      />

      {isLoading ? (
        <LoadingState type="table" />
      ) : (
        <DataTable
          data={data?.content || []}
          columns={columns}
          loading={isLoading}
          pagination={{
            currentPage: page,
            totalPages: data?.totalPages || 0,
            totalItems: data?.totalItems || 0,
            pageSize: pageSize,
          }}
          onPageChange={setPage}
        />
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Advertisement"
        message="Are you sure you want to delete this ad? This will permanently remove it from the system."
        confirmText="Yes, Delete Ad"
        loading={deleteMutation.isLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default AdsTable;
