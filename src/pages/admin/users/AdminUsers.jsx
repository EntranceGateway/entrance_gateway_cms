import Layout from "../../../../components/layout/Layout";
import AdminTable from "./components/AdminTable";

function AdminUsers() {
  return (
    <Layout>
      <div className="p-6">
        <AdminTable />
      </div>
    </Layout>
  );
}

export default AdminUsers;
