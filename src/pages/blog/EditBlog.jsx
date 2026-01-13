import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import BlogForm from "./components/BlogForm";
import { getBlogById, updateBlog } from "../../http/blog";
import { FormSkeleton } from "@/components/loaders";

const EditBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogById(id);
        setBlog(res.data.data);
      } catch (err) {
        setError(err.error || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleSubmit = async (formData) => {
    await updateBlog(id, formData);
  };

  if (loading) {
    return (
      <Layout>
        <FormSkeleton />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <BlogForm mode="edit" initialData={blog} onSubmit={handleSubmit} />
    </Layout>
  );
};

export default EditBlog;
