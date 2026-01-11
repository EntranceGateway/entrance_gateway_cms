import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllAdmins,
  deleteAdmin,
  updateAdminRole,
  updateAdminDetails,
  ADMIN_ROLES,
} from "../../../../http/adminget";
import tokenService from "../../../../auth/services/tokenService";
import PageHeader from "@/components/common/PageHeader";
import DataTable from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";
import {
  Plus,
  Trash2,
  Shield,
  Mail,
  User,
  ChevronDown,
  Edit2,
  X,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Users
} from "lucide-react";

/**
 * Main AdminTable Component
 */
const AdminTable = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [editingRole, setEditingRole] = useState(null);
  const [editingAdmin, setEditingAdmin] = useState(null); // For Edit Modal
  const [sortBy, setSortBy] = useState("adminId");
  const [sortDir, setSortDir] = useState("asc");
  const PAGE_SIZE = 10;

  // Check if current user is SUPER_ADMIN
  const userRole = tokenService.getUserRole();
  const isSuperAdmin = Array.isArray(userRole)
    ? userRole.includes("SUPER_ADMIN")
    : userRole === "SUPER_ADMIN";

  // Get user for email check (self-deletion prevention)
  const user = JSON.parse(
    typeof window !== "undefined"
      ? localStorage.getItem("user") || "{}"
      : "{}"
  );

  // Fetch Admins
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await getAllAdmins({
        page,
        size: PAGE_SIZE,
        sortBy,
        sortDir,
      });
      const responseData = res.data?.data || res.data;
      const data = Array.isArray(responseData)
        ? responseData
        : responseData?.content || [];
      setAdmins(data);
      setTotalPages(responseData?.totalPages || 1);
      setTotalElements(responseData?.totalElements || data.length);
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
    if (
      !window.confirm(
        `Are you sure you want to delete admin with email: ${email}?`
      )
    )
      return;

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

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle Sorting
  const handleSort = (key, direction) => {
    setSortBy(key);
    setSortDir(direction);
  };

  // Define Columns
  const columns = [
    {
      key: "admin",
      label: "Admin",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
            {row.name
              ? row.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : row.role === "SUPER_ADMIN"
              ? "SA"
              : row.email?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {row.name || (row.role === "SUPER_ADMIN" ? "SUPER ADMIN" : "-")}
            </div>
            {row.email === user?.email && (
              <span className="text-xs text-indigo-600 font-medium">(You)</span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (row) => (
        <div className="flex items-center gap-2 text-gray-600">
          <Mail size={16} className="text-gray-400" />
          {row.email || "-"}
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (row) => {
        if (editingRole === (row.id || row.adminId)) {
          return (
            <select
              className="border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
              defaultValue={row.role}
              onChange={(e) =>
                handleRoleUpdate(row.id || row.adminId, e.target.value)
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
          );
        }

        let badgeVariant = "default";
        if (row.role === "SUPER_ADMIN") badgeVariant = "subject"; // Purple
        else if (row.role === "ADMIN") badgeVariant = "code"; // Indigo
        
        return (
          <div className="flex items-center gap-2 group">
             <Badge variant={badgeVariant} className="flex items-center gap-1">
                <Shield size={12} />
                {row.role.replace('_', ' ')}
             </Badge>
            
            {isSuperAdmin && row.email !== user?.email && (
              <button
                onClick={() => setEditingRole(row.id || row.adminId)}
                className="text-gray-400 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100"
                title="Change Role"
              >
                <Edit2 size={14} />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  // Add Actions column if Super Admin
  if (isSuperAdmin) {
    columns.push({
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          {/* Edit Button */}
          <button
            onClick={() => setEditingAdmin(row)}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit Admin"
          >
            <Edit2 size={18} />
          </button>

          {/* Delete Button */}
          {row.email !== user?.email && row.role !== "SUPER_ADMIN" && (
            <button
              onClick={() => handleDelete(row.email)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Admin"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      ),
    });
  }

  return (
    <div className="w-full">
      <PageHeader
        title="Admin Users Management"
        subtitle="Manage admin users, roles, and permissions"
        icon={Users}
        actions={
          isSuperAdmin
            ? [
                {
                  label: "Add New User",
                  icon: <Plus size={20} />,
                  onClick: () => navigate("/admin/users/add"),
                  variant: "primary",
                },
              ]
            : []
        }
      />

      {/* Info Banner for non-super admins */}
      {!isSuperAdmin && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 flex items-start gap-3">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <div>
                 <p className="font-semibold text-sm">Access Limited</p>
                <p className="text-sm">
                    Only Super Admins can add or delete admin users. You can view the list of administrators.
                </p>
            </div>
        </div>
      )}

      {/* Table */}
      <DataTable
        data={admins}
        columns={columns}
        loading={loading}
        pagination={{
            currentPage: page, // DataTable is 0-indexed internally usually, let's verify. Yes it is in DataTable.jsx lines 191-201
            totalPages: totalPages,
            totalItems: totalElements,
            pageSize: PAGE_SIZE
        }}
        onPageChange={handlePageChange}
        onSort={handleSort}
        emptyMessage="No admin users found"
      />

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
      setError(
        typeof err === "string" ? err : err.message || "Failed to update admin"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800">Edit Admin User</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2 border border-red-100">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User size={16} />
              </span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                placeholder="Full Name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                placeholder="Email Address"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
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
              className="flex-1 py-2.5 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow"
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
