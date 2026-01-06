import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllAdmins,
  deleteAdmin,
  updateAdminRole,
  ADMIN_ROLES,
} from "../../../../http/adminget";
import Pagination from "../../../../Verification/Pagination";
import { Plus, Trash2, Shield, Mail, User, ChevronDown } from "lucide-react";

const AdminTable = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [editingRole, setEditingRole] = useState(null);
  const [sortBy, setSortBy] = useState("adminId");
  const [sortDir, setSortDir] = useState("asc");
  const PAGE_SIZE = 10;

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Check if current user is SUPER_ADMIN
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  // Fetch Admins
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await getAllAdmins({ 
        page, 
        size: PAGE_SIZE,
        sortBy,
        sortDir 
      }, token);
      const responseData = res.data?.data || res.data;
      const data = Array.isArray(responseData) 
        ? responseData 
        : responseData?.content || [];
      setAdmins(data);
      setTotalPages(responseData?.totalPages || 1);
    } catch (err) {
      console.error("Fetch Admins Error:", err);
      // If getAllAdmins endpoint doesn't exist, show empty
      setAdmins([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, [page, sortBy, sortDir]);

  // Delete Admin
  const handleDelete = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      await deleteAdmin(adminId, token);
      fetchAdmins();
    } catch (err) {
      console.error("Delete Admin Error:", err);
      alert(err.message || "Failed to delete admin");
    }
  };

  // Update Role
  const handleRoleUpdate = async (adminId, newRole) => {
    try {
      await updateAdminRole(adminId, newRole, token);
      setEditingRole(null);
      fetchAdmins();
    } catch (err) {
      console.error("Update Role Error:", err);
      alert(err.message || "Failed to update role");
    }
  };

  // Get role badge
  const getRoleBadge = (role) => {
    const roleData = ADMIN_ROLES.find((r) => r.value === role);
    return roleData || { label: role, color: "bg-gray-100 text-gray-800" };
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage - 1);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Users Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage admin users and their roles
          </p>
        </div>
        {isSuperAdmin && (
          <Link
            to="/admin/users/add"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all duration-200"
          >
            <Plus size={20} />
            Add New Admin User
          </Link>
        )}
      </div>

      {/* Info Banner for non-super admins */}
      {!isSuperAdmin && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          <p className="text-sm">
            <strong>Note:</strong> Only Super Admins can add or delete admin users.
          </p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Admin
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Email
                </th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">
                  Role
                </th>
                {isSuperAdmin && (
                  <th className="p-4 text-center text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 4 : 3} className="p-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 4 : 3} className="p-8 text-center text-gray-500">
                    No admins found.
                  </td>
                </tr>
              ) : (
                admins.map((admin) => {
                  const roleBadge = getRoleBadge(admin.role);
                  return (
                    <tr
                      key={admin.id || admin.adminId || admin.email}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      {/* Name */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {admin.name 
                              ? admin.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                              : admin.role === 'SUPER_ADMIN' 
                                ? 'SA' 
                                : admin.email?.charAt(0)?.toUpperCase() || 'A'}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {admin.name || (admin.role === 'SUPER_ADMIN' ? 'SUPER ADMIN' : '-')}
                            </div>
                            {admin.email === user?.email && (
                              <span className="text-xs text-indigo-600">(You)</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={16} />
                          {admin.email || "-"}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="p-4">
                        {editingRole === (admin.id || admin.adminId) ? (
                          <select
                            className="border rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-500"
                            defaultValue={admin.role}
                            onChange={(e) =>
                              handleRoleUpdate(admin.id || admin.adminId, e.target.value)
                            }
                            onBlur={() => setEditingRole(null)}
                            autoFocus
                          >
                            {ADMIN_ROLES.map((role) => (
                              <option key={role.value} value={role.value}>
                                {role.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${roleBadge.color}`}
                            >
                              <Shield size={12} className="inline mr-1" />
                              {roleBadge.label}
                            </span>
                            {isSuperAdmin && admin.email !== user?.email && (
                              <button
                                onClick={() => setEditingRole(admin.id || admin.adminId)}
                                className="text-gray-400 hover:text-indigo-600 transition-colors"
                                title="Change Role"
                              >
                                <ChevronDown size={16} />
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      {isSuperAdmin && (
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            {admin.email !== user?.email && (
                              <button
                                onClick={() => handleDelete(admin.id || admin.adminId)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Admin"
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
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

export default AdminTable;
