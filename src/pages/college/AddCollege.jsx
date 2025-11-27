import Layout from "../../../components/layout/Layout";
import { createColleges } from "../../http/colleges";
import CollegeForm from "./components/form/Form";

export default function AddCollege() {
  const token = localStorage.getItem("token");

  const handleAdd = async (data) => {
    return await createColleges(data, token);
  };

  return (
    <Layout>
      <CollegeForm mode="add" onSubmit={handleAdd} />
    </Layout>
  );
}
