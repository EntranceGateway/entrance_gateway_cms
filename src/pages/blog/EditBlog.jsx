import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../../components/layout/Layout";
import BlogForm from "./components/BlogForm";
import { getBlogById, updateBlog } from "../../http/blog";
import Spinner from "../../../components/Spinner/Spinner";

const EditBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogById(id, token);
        setBlog(res.data.data);
      } catch (err) {
        setError(err.error || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, token]);

  const handleSubmit = async (formData) => {
    await updateBlog(id, formData, token);
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
        <BlogForm mode="edit" initialData={blog} onSubmit={handleSubmit} />
      </div>
    </Layout>
  );
};

export default EditBlog;
