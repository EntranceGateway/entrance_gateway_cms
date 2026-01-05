import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../../components/layout/Layout";
import NoticeForm from "./components/NoticeForm";
import { getNoticeById, updateNotice } from "../../http/notice";
import Spinner from "../../../components/Spinner/Spinner";

const EditNotice = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await getNoticeById(id, token);
        setNotice(res.data.data);
      } catch (err) {
        setError(err.error || "Failed to load notice");
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id, token]);

  const handleSubmit = async (formData) => {
    await updateNotice(id, formData, token);
  };

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
        <NoticeForm mode="edit" initialData={notice} onSubmit={handleSubmit} />
      </div>
    </Layout>
  );
};

export default EditNotice;
