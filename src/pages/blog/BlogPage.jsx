import Layout from "../../../components/layout/Layout";
import BlogTable from "./components/BlogTable";

const BlogPage = () => {
  return (
    <Layout>
      <div className="p-6">
        <BlogTable />
      </div>
    </Layout>
  );
};

export default BlogPage;
