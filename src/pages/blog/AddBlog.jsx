import Layout from "@/components/layout/Layout";

import BlogForm from "./components/BlogForm";
import { createBlog } from "../../http/blog";

const AddBlog = () => {
  const handleSubmit = async (formData) => {
    await createBlog(formData);
  };

  return (
    <Layout>
      <div className="p-6">
        <BlogForm mode="add" onSubmit={handleSubmit} />
      </div>
    </Layout>
  );
};

export default AddBlog;
