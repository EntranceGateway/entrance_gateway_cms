import Layout from "@/components/layout/Layout";
import AdsTable from "./components/AdsTable";

function AllAds() {
  return (
    <Layout>
      <div className="p-6">
        <AdsTable />
      </div>
    </Layout>
  );
}

export default AllAds;
