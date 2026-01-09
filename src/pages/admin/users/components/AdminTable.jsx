import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import {
  getAllAdmins,
  deleteAdmin,
  updateAdminRole,
  updateAdminDetails,
  ADMIN_ROLES,
} from "../../../../http/adminget";
import Pagination from "../../../../Verification/Pagination";
import { Plus, Trash2, Shield, Mail, User, ChevronDown, Edit2, X, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

/**
 * Main AdminTable Component
 */
const AdminTable = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [editingRole, setEditingRole] = useState(null);
  const [editingAdmin, setEditingAdmin] = useState(null); // For Edit Modal
  const [sortBy, setSortBy] = useState("adminId");
  const [sortDir, setSortDir] = useState("asc");
  const PAGE_SIZE = 10;


  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Check if current user is SUPER_ADMIN
  const isSuperAdmin = user?.role?.toUpperCase() === "SUPER_ADMIN";

  // Fetch Admins
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await getAllAdmins({
        page,
        size: PAGE_SIZE,
        sortBy,
        sortDir
      });
      const responseData = res.data?.data || res.data;
      const data = Array.isArray(responseData)
        ? responseData
        : responseData?.content || [];
      setAdmins(data);
      setTotalPages(responseData?.totalPages || 1);
    } catch (err) {
      console.error("Fetch Admins Error:", err);
      setAdmins([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, [page, sortBy, sortDir]);

  // Delete Admin
  const handleDelete = async (email) => {
    if (!window.confirm(`Are you sure you want to delete admin with email: ${email}?`)) return;

    try {
      await deleteAdmin(email);
      fetchAdmins();
    } catch (err) {
      console.error("Delete Admin Error:", err);
      alert(err.message || "Failed to delete admin");
    }
  };

  // Update Role
  const handleRoleUpdate = async (adminId, newRole) => {
    try {
      await updateAdminRole(adminId, newRole);
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

      {/* Edit Modal */}
      {editingAdmin && (
        <EditAdminModal
          admin={editingAdmin}

          onClose={() => setEditingAdmin(null)}
          onSuccess={() => {
            setEditingAdmin(null);
            fetchAdmins();
          }}
        />
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
                            {/* Edit Button */}
                            <button
                              onClick={() => setEditingAdmin(admin)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Admin"
                            >
                              <Edit2 size={18} />
                            </button>

                            {/* Delete Button */}
                            {admin.email !== user?.email && (
                              <button
                                onClick={() => handleDelete(admin.email)} // Passing email for deletion
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

/**
 * Edit Admin Modal Component
 */
const EditAdminModal = ({ admin, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: admin?.name || "",
    email: admin?.email || "",
    password: "", // Password is optional or required depending on validaton logic, but usually required for full update if API demands it. Based on prompt: data: "name, email, password".
    // Assuming password is required for this specific update endpoint based on "request body: name, email, password" description.
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      await updateAdminDetails(form);
      onSuccess();
    } catch (err) {
      setError(typeof err === 'string' ? err : (err.message || "Failed to update admin"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">Edit Admin User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User size={16} />
              </span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                placeholder="Full Name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                placeholder="Email Address"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                placeholder="New Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Required for update</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Updating..." : "Update Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminTable;
