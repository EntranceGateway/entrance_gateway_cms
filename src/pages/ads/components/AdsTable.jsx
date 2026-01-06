import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAds, deleteAd, AD_POSITIONS, AD_STATUSES, AD_PRIORITIES } from "../../../http/ads";
import Pagination from "../../../Verification/Pagination";
import { Plus, Edit, Trash2, Eye, Calendar, Image, DollarSign } from "lucide-react";

const AdsTable = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const PAGE_SIZE = 10;

  const token = localStorage.getItem("token");

  // Fetch Ads
  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await getAds({ page, size: PAGE_SIZE }, token);
      const responseData = res.data?.data || res.data;
      const data = responseData?.content || [];
      setAds(data);
      setTotalPages(responseData?.totalPages || 0);
    } catch (err) {
      console.error("Fetch Ads Error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAds();
  }, [page]);

  // Delete Ad
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ad?")) return;

    try {
      await deleteAd(id, token);
      fetchAds();
    } catch (err) {
      console.error("Delete Ad Error:", err);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage - 1);
  };

  // Get label from value
  const getLabel = (options, value) => {
    const option = options.find((o) => o.value === value);
    return option?.label || value || "-";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const colors = {
      ACTIVE: "bg-green-100 text-green-800",
      DRAFT: "bg-gray-100 text-gray-800",
      PAUSED: "bg-yellow-100 text-yellow-800",
      EXPIRED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  // Get priority badge color
  const getPriorityBadge = (priority) => {
    const colors = {
      HIGH: "bg-red-100 text-red-800",
      MEDIUM: "bg-yellow-100 text-yellow-800",
      LOW: "bg-blue-100 text-blue-800",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ads Management</h1>
        <Link
          to="/ads/add"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200"
        >
          <Plus size={20} />
          Add New Ad
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Image</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Title</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Position</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Priority</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Duration</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Budget</th>
                <th className="p-4 text-center text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : ads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No ads found.
                  </td>
                </tr>
              ) : (
                ads.map((ad) => (
                  <tr
                    key={ad.adId}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    {/* Image */}
                    <td className="p-4">
                      {ad.images && ad.images.length > 0 ? (
                        <img
                          src={`https://api.entrancegateway.com/images/${ad.images[0]}`}
                          alt={ad.title}
                          className="h-12 w-16 object-cover rounded-md"
                        />
                      ) : (
                        <div className="h-12 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                          <Image size={20} className="text-gray-400" />
                        </div>
                      )}
                    </td>

                    {/* Title */}
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{ad.title || "-"}</div>
                      <div className="text-xs text-gray-500">{ad.banner}</div>
                    </td>

                    {/* Position */}
                    <td className="p-4 text-gray-600">
                      {getLabel(AD_POSITIONS, ad.position)}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(ad.status)}`}>
                        {getLabel(AD_STATUSES, ad.status)}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(ad.priority)}`}>
                        {getLabel(AD_PRIORITIES, ad.priority)}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar size={14} />
                        <span>{formatDate(ad.startDate)}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        to {formatDate(ad.endDate)}
                      </div>
                    </td>

                    {/* Budget */}
                    <td className="p-4">
                      {ad.totalBudget ? (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <DollarSign size={14} />
                          <span>{ad.totalBudget.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/ads/edit/${ad.adId}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(ad.adId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t">
            <Pagination
              currentPage={page + 1}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdsTable;
