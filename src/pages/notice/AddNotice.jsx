import Layout from "@/components/layout/Layout";

import NoticeForm from "./components/NoticeForm";
import { createNotice } from "../../http/notice";

const AddNotice = () => {
  const handleSubmit = async (formData) => {
    await createNotice(formData);
  };

  return (
    <Layout>
      <NoticeForm mode="add" onSubmit={handleSubmit} />
    </Layout>
  );
};

export default AddNotice;
