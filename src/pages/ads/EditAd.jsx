import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import AdsForm from "./components/AdsForm";
import Spinner from "@/components/common/Spinner";
import { getAds } from "../../http/ads";

function EditAd() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await getAds({ page: 0, size: 100 });
        const data = res.data?.data?.content || res.data?.content || [];
        const foundAd = data.find((a) => a.adId === id);
        if (foundAd) {
          setAd(foundAd);
        } else {
          setError("Ad not found");
        }
      } catch (err) {
        setError(err.error || "Failed to fetch ad");
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <AdsForm mode="edit" initialData={ad} adId={id} />
      </div>
    </Layout>
  );
}

export default EditAd;
