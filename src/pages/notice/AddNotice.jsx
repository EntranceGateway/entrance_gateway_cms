import Layout from "@/components/layout/Layout";

import NoticeForm from "./components/NoticeForm";
import { createNotice } from "../../http/notice";

const AddNotice = () => {
  const handleSubmit = async (formData) => {
    await createNotice(formData);
  };

  return (
    <Layout>
      <div className="p-6">
        <NoticeForm mode="add" onSubmit={handleSubmit} />
      </div>
    </Layout>
  );
};

export default AddNotice;
