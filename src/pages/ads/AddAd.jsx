import Layout from "../../../components/layout/Layout";
import AdsForm from "./components/AdsForm";

function AddAd() {
  return (
    <Layout>
      <div className="p-6">
        <AdsForm mode="create" />
      </div>
    </Layout>
  );
}

export default AddAd;
