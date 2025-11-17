import Layout from "../../../components/layout/layout";

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
    </Layout>
  );
}
