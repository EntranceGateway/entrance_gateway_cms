import Layout from "../../../components/layout/Layout";
import NoticeForm from "./components/NoticeForm";
import { createNotice } from "../../http/notice";

const AddNotice = () => {
  const token = localStorage.getItem("token");

  const handleSubmit = async (formData) => {
    await createNotice(formData, token);
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
