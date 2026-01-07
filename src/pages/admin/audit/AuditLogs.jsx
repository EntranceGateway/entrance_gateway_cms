import React, { useState, useEffect } from "react";
import Layout from "../../../../components/layout/Layout";
import auditLogService from "../../../http/auditLogService";
import { 
  Search, Filter, Calendar, Download, RefreshCw, 
  ChevronLeft, ChevronRight, Eye, AlertCircle,
  Shield, CheckCircle, XCircle, Clock
} from "lucide-react";
import toast from "react-hot-toast";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0
  });
  
  // Filters
  const [actionFilter, setActionFilter] = useState("");
  const [availableActions, setAvailableActions] = useState([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showFilters, setShowFilters] = useState(false);

  // Selected log for detailed view
  const [selectedLog, setSelectedLog] = useState(null);

  // Initial fetch
  useEffect(() => {
    fetchLogs();
    fetchActions();
  }, [pagination.page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // Logic to choose which API endpoint to use based on active filters
      let response;
      if (dateRange.start && dateRange.end) {
        response = await auditLogService.getAuditLogsByDateRange(dateRange.start, dateRange.end);
      } else if (actionFilter) {
        response = await auditLogService.getAuditLogsByAction(actionFilter);
      } else {
        response = await auditLogService.getAllAuditLogs({ 
          page: pagination.page,
          size: pagination.size 
        });
      }

      const data = response.data;
      if (data.content) {
        setLogs(data.content);
        setPagination(prev => ({
          ...prev,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          pageNumber: data.pageNumber
        }));
      } else if (Array.isArray(data)) {
        // Handle endpoints that might return array directly (like filters)
        setLogs(data);
        setPagination(prev => ({ ...prev, totalElements: data.length, totalPages: 1 }));
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  const fetchActions = async () => {
    try {
      const res = await auditLogService.getAuditActions();
      if (res.data) setAvailableActions(res.data);
    } catch (err) {
      console.error("Failed to load actions", err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 0 })); // Reset to first page
    fetchLogs();
  };

  const clearFilters = () => {
    setActionFilter("");
    setDateRange({ start: "", end: "" });
    setPagination(prev => ({ ...prev, page: 0 }));
    // Slightly hacky: we need to wait for state update or force a refetch logic
    // Usually easier to just reload or manually call basic fetch
    setTimeout(() => {
       auditLogService.getAllAuditLogs({ page: 0, size: 20 })
         .then(res => {
            const data = res.data;
            setLogs(data.content);
            setPagination({
              page: 0,
              size: 20,
              totalElements: data.totalElements,
              totalPages: data.totalPages
            });
         });
    }, 100);
  };

  // Helper to get color for action type
  const getActionColor = (action) => {
    const map = {
      'CREATE': 'bg-green-100 text-green-800',
      'UPDATE': 'bg-blue-100 text-blue-800',
      'DELETE': 'bg-red-100 text-red-800',
      'LOGIN_SUCCESS': 'bg-teal-100 text-teal-800',
      'LOGIN_FAILED': 'bg-orange-100 text-orange-800',
      'LOGOUT': 'bg-gray-100 text-gray-800',
      'PASSWORD_CHANGE': 'bg-purple-100 text-purple-800',
    };
    return map[action] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout>
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Shield className="text-indigo-600" />
              Security Audit Logs
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Track and monitor all administrative actions
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              <Filter size={18} />
              Filters
            </button>
            <button 
              onClick={fetchLogs}
              className="p-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
              title="Refresh Logs"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="p-6 bg-gray-50 border-b border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
              <select 
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              >
                <option value="">All Actions</option>
                {availableActions.map(action => (
                  <option key={action} value={action}>{action.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input 
                type="datetime-local" 
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input 
                type="datetime-local" 
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              />
            </div>

            <div className="flex items-end gap-2">
              <button 
                onClick={applyFilters}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Apply
              </button>
              <button 
                onClick={clearFilters}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Admin</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Entity</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    Loading audit records...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    No audit logs found matching your criteria
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{log.adminName || "System"}</div>
                      <div className="text-xs text-gray-500">{log.adminEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {log.entityType} 
                      {log.entityId && <span className="text-xs text-gray-400 block font-mono mt-0.5 max-w-[100px] truncate">{log.entityId}</span>}
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={log.description}>
                      {log.description}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.responseStatus >= 200 && log.responseStatus < 300 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {log.responseStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{pagination.page * pagination.size + 1}</span> to <span className="font-medium">{Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)}</span> of <span className="font-medium">{pagination.totalElements}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 0}
              className="p-2 border rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-gray-700">
              Page {pagination.page + 1} of {pagination.totalPages || 1}
            </span>
            <button 
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages - 1}
              className="p-2 border rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Audit Log Details
                <span className="text-xs font-mono bg-gray-200 px-2 py-0.5 rounded text-gray-600">#{selectedLog.id}</span>
              </h3>
              <button 
                onClick={() => setSelectedLog(null)}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <XCircle size={24} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Main Info Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Actor</label>
                  <div className="mt-1 font-medium text-gray-900">{selectedLog.adminName}</div>
                  <div className="text-sm text-gray-500">{selectedLog.adminEmail}</div>
                  <div className="mt-1 inline-block px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-800 font-medium">
                    {selectedLog.adminRole}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Action</label>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded text-sm font-bold ${getActionColor(selectedLog.action)}`}>
                      {selectedLog.action}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold">{selectedLog.requestMethod}</span> {selectedLog.requestUri}
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">IP Address:</span>
                  <span className="font-mono text-gray-700">{selectedLog.ipAddress}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Status Code:</span>
                  <span className={`font-mono font-bold ${selectedLog.responseStatus < 300 ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedLog.responseStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Timestamp:</span>
                  <span className="text-gray-700">{new Date(selectedLog.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {/* User Agent */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">User Agent</label>
                <div className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 font-mono break-all">
                  {selectedLog.userAgent}
                </div>
              </div>

              {/* Full Description */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                <p className="mt-1 text-gray-700 leading-relaxed bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm">
                  {selectedLog.description}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setSelectedLog(null)}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
