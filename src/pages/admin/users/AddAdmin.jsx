import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../../components/layout/Layout";
import { registerAdmin } from "../../../http/adminget";
import { AlertCircle, User, Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

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

  const token = localStorage.getItem("token");

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
      await registerAdmin(form, token);
      setStatus({
        loading: false,
        success: "Admin created successfully!",
        error: "",
      });
      setTimeout(() => navigate("/admin/users"), 1500);
    } catch (err) {
      // Handle field-specific validation errors from backend
      if (err && typeof err === "object" && !err.message && !err.error) {
        // Backend returned field-specific errors like { name: "...", password: "..." }
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
    `mt-1 block w-full rounded-lg border px-3 py-3 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200
    ${errors[field] ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"}`;

  return (
    <Layout>
      <div className="p-6 max-w-xl mx-auto">
        {/* Back Link */}
        <Link
          to="/admin/users"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Admin Users
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Register New Admin</h2>
            <p className="text-indigo-100 mt-1">
              Create a new admin account with default ADMIN role
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Status Messages */}
            {status.error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                <AlertCircle size={20} />
                {status.error}
              </div>
            )}
            {status.success && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                {status.success}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User size={16} />
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name (min 5 characters)"
                className={inputClass("name")}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail size={16} />
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className={inputClass("email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Lock size={16} />
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Info */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
              <strong>Note:</strong> New admins will be assigned the{" "}
              <span className="font-semibold">ADMIN</span> role by default. You can
              change their role after creation from the admin list.
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/users")}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status.loading}
                className={`flex-1 py-3 px-4 text-white rounded-lg font-medium transition-all duration-200 ${
                  status.loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {status.loading ? "Creating..." : "Create Admin"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddAdmin;
