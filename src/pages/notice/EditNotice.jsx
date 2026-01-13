import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import NoticeForm from "./components/NoticeForm";
import { getNoticeById, updateNotice } from "../../http/notice";
import { InlineSpinner } from "@/components/loaders";

const EditNotice = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await getNoticeById(id);
        setNotice(res.data.data);
      } catch (err) {
        setError(err.error || "Failed to load notice");
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  const handleSubmit = async (formData) => {
    await updateNotice(id, formData);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <InlineSpinner size="xl" />
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
      <NoticeForm mode="edit" initialData={notice} onSubmit={handleSubmit} />
    </Layout>
  );
};

export default EditNotice;
