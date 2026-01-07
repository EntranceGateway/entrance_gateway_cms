import Layout from "../../../components/layout/Layout";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Clock, ArrowRight } from "lucide-react";
import auditLogService from "../../../src/http/auditLogService";
import tokenService from "../../../src/auth/services/tokenService";

export default function Dashboard() {
  return (
    <Layout>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-gray-500">Total Colleges</h3>
        <p className="text-3xl font-bold">42</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-gray-500">Total Courses</h3>
        <p className="text-3xl font-bold">210</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-gray-500">Notes Uploaded</h3>
        <p className="text-3xl font-bold">350</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-gray-500">Entrance Forms</h3>
        <p className="text-3xl font-bold">1,420</p>
      </div>

    </div>

      {/* Recent Audit Logs (Only for Super Admin) */}
      {(() => {
        const role = tokenService.getUserRole();
        const isSuperAdmin = Array.isArray(role) 
          ? role.some(r => String(r).toLowerCase() === 'super_admin') 
          : String(role || '').toLowerCase() === 'super_admin';

        if (!isSuperAdmin) return null;

        const [logs, setLogs] = useState([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
          const fetchRecentLogs = async () => {
            try {
              const response = await auditLogService.getAllAuditLogs({ 
                page: 0, 
                size: 5, 
                sortDir: 'desc' 
              });
              setLogs(response.data?.content || []);
            } catch (error) {
              console.error("Failed to load recent logs", error);
            } finally {
              setLoading(false);
            }
          };
          fetchRecentLogs();
        }, []);

        return (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="text-violet-600" size={20} />
                <h3 className="font-semibold text-gray-800">Recent Security Activity</h3>
              </div>
              <Link 
                to="/admin/audit-logs" 
                className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1 transition-colors"
              >
                View Changes Log
                <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="p-0">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading activity...</div>
              ) : logs.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No recent activity found</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {logs.map((log) => (
                    <div key={log.id} className="px-6 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          log.action.includes("DELETE") ? "bg-red-50 text-red-600" :
                          log.action.includes("CREATE") ? "bg-green-50 text-green-600" :
                          log.action.includes("UPDATE") ? "bg-blue-50 text-blue-600" :
                          "bg-gray-100 text-gray-600"
                        }`}>
                          <Clock size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            <span className="font-bold">{log.action.replace(/_/g, " ")}:</span> {log.entityName || `${log.entityType} #${log.entityId}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            by {log.adminEmail} • {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
                        {log.entityType}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </Layout>
  );
}
