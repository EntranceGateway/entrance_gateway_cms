import Layout from "@/components/layout/Layout";
import React from "react";
import tokenService from "../../../src/auth/services/tokenService";
import RecentAuditLogs from "./components/RecentAuditLogs";

export default function Dashboard() {
  const role = tokenService.getUserRole();
  const isSuperAdmin = Array.isArray(role)
    ? role.some(r => String(r).toLowerCase() === 'super_admin')
    : String(role || '').toLowerCase() === 'super_admin';

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
      {isSuperAdmin && <RecentAuditLogs />}
    </Layout>
  );
}

