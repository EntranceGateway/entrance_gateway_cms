import { useEffect, useState } from "react";

import Layout from "@/components/layout/Layout";
import { getAdmin, ADMIN_ROLES } from "../../http/adminget";
import { User, Mail, Shield, Loader2 } from "lucide-react";

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getAdmin();
        const data = res.data?.data || res.data;
        setProfile(data);
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Get display name - if no name and SUPER_ADMIN, show "SUPER ADMIN"
  const getDisplayName = () => {
    if (!profile) return "";
    if (profile.name) return profile.name;
    if (profile.role === "SUPER_ADMIN") return "SUPER ADMIN";
    return "No Name";
  };

  // Get role badge
  const getRoleBadge = () => {
    if (!profile) return null;
    const roleData = ADMIN_ROLES.find((r) => r.value === profile.role);
    return roleData || { label: profile.role, color: "bg-gray-100 text-gray-800" };
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center mt-10">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  const roleBadge = getRoleBadge();

  return (
    <Layout>
      <div className="flex justify-center mt-10">
        <div className="w-full max-w-2xl">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-10">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile?.name
                    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    : profile?.role === 'SUPER_ADMIN'
                      ? 'SA'
                      : profile?.email?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {getDisplayName()}
                  </h2>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${roleBadge?.color}`}>
                    <Shield size={12} className="inline mr-1" />
                    {roleBadge?.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-8 space-y-6">
              {/* Full Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User size={16} />
                  Full Name
                </label>
                <div className="w-full border rounded-lg px-4 py-3 bg-gray-50 text-gray-800">
                  {getDisplayName()}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} />
                  Email Address
                </label>
                <div className="w-full border rounded-lg px-4 py-3 bg-gray-50 text-gray-800">
                  {profile?.email || "-"}
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Shield size={16} />
                  Role
                </label>
                <div className="w-full border rounded-lg px-4 py-3 bg-gray-50">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleBadge?.color}`}>
                    {roleBadge?.label}
                  </span>
                </div>
              </div>

              {/* Info Note */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                <strong>Note:</strong> To update your profile information, please contact a Super Admin.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
