import Layout from "../../../components/layout/Layout";

export default function AdminProfile() {
  return (
    <Layout>
      <div className="flex justify-center mt-10">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow p-8">

          {/* Title */}
          <h2 className="text-2xl font-semibold text-center mb-8">
            My Profile
          </h2>

          {/* Full Name */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="Super Admin"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
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

          {/* Phone */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="98XXXXXXXX"
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">
              Role
            </label>
            <input
              type="text"
              value="SUPER_ADMIN"
              disabled
              className="w-full border rounded-lg px-4 py-3 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Button */}
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
            Update Profile
          </button>

        </div>
      </div>
    </Layout>
  );
}
