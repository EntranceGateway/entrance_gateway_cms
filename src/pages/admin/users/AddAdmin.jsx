import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { registerAdmin } from "../../../http/adminget";
import PageHeader from "@/components/common/PageHeader";
import { AlertCircle, User, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";

const AddAdmin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, success: "", error: "" });

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.length < 5) {
      newErrors.name = "Name must be at least 5 characters";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus({ loading: true, success: "", error: "" });
    setErrors({});

    try {
      await registerAdmin(form);
      setStatus({
        loading: false,
        success: "Admin created successfully!",
        error: "",
      });
      setTimeout(() => navigate("/admin/users"), 1500);
    } catch (err) {
      // Handle field-specific validation errors from backend
      if (err && typeof err === "object" && !err.message && !err.error) {
        setErrors(err);
        setStatus({
          loading: false,
          success: "",
          error: "Please fix the validation errors below.",
        });
      } else {
        setStatus({
          loading: false,
          success: "",
          error: err.message || err.error || "Failed to create admin",
        });
      }
    }
  };

  const inputClass = (field) =>
    `mt-1 block w-full rounded-xl border px-3 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none
    ${errors[field] ? "border-red-300 ring-1 ring-red-300 bg-red-50" : "border-gray-200"}`;

  return (
    <Layout>
      <PageHeader
        title="Register New Admin"
        subtitle="Create a new admin account with default permissions"
        icon={UserPlus}
        breadcrumbs={[
          { label: "Admin Users", path: "/admin/users" },
          { label: "Add Admin" },
        ]}
      />

      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Status Messages */}
            {status.error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                <AlertCircle size={20} className="shrink-0" />
                <span className="text-sm font-medium">{status.error}</span>
              </div>
            )}
            {status.success && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
                {status.success}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                <User size={16} className="text-gray-400" />
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className={inputClass("name")}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500 animate-in slide-in-from-top-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                <Mail size={16} className="text-gray-400" />
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@company.com"
                className={inputClass("email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 animate-in slide-in-from-top-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                <Lock size={16} className="text-gray-400" />
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 8 characters"
                  className={inputClass("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password ? (
                 <p className="mt-1 text-sm text-red-500 animate-in slide-in-from-top-1">{errors.password}</p>
              ) : (
                 <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    Secure password required
                 </p>
              )}
            </div>

            {/* Info */}
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 text-sm flex items-start gap-2">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p>
                New admins will be assigned the <span className="font-bold">ADMIN</span> role by default. 
                You can change their permissions later from the admin list.
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="flex-1 py-3 px-4 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status.loading}
                className={`flex-1 py-3 px-4 text-white rounded-xl font-bold shadow-sm transition-all duration-200 flex items-center justify-center gap-2 ${status.loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5"
                  }`}
              >
                {status.loading ? "Creating Account..." : "Create Admin User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddAdmin;
