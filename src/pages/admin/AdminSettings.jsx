import Layout from "../../../components/layout/Layout";

export default function AdminSettings() {
  return (
    <Layout>
      <div className="flex justify-center mt-10">
        <div className="w-full max-w-2xl space-y-8">

          {/* ================= Profile Settings ================= */}
          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-2xl font-semibold text-center mb-8">
              Settings
            </h2>

            <h3 className="text-lg font-medium mb-6">
              Profile Settings
            </h3>

            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">
                Admin Name *
              </label>
              <input
                type="text"
                placeholder="Super Admin"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value="superadmin@gmail.com"
                disabled
                className="w-full border rounded-lg px-4 py-3 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="98XXXXXXXX"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Save Changes
            </button>
          </div>

          {/* ================= Security ================= */}
          <div className="bg-white rounded-xl shadow p-8">
            <h3 className="text-lg font-medium mb-6">
              Security
            </h3>

            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">
                Current Password *
              </label>
              <input
                type="password"
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">
                New Password *
              </label>
              <input
                type="password"
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Update Password
            </button>
          </div>

          {/* ================= Notifications ================= */}
          <div className="bg-white rounded-xl shadow p-8">
            <h3 className="text-lg font-medium mb-6">
              Notifications
            </h3>

            <div className="flex items-center justify-between mb-4">
              <span>Email Notifications</span>
              <input type="checkbox" className="h-5 w-5" />
            </div>

            <div className="flex items-center justify-between">
              <span>Push Notifications</span>
              <input type="checkbox" className="h-5 w-5" />
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
