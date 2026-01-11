// No change needed for this file as getting ready for verification
import Layout from "@/components/layout/Layout";

import { createColleges } from "../../http/colleges";
import CollegeForm from "./components/form/Form";

export default function AddCollege() {
  const handleAdd = async (formData, logo, images) => {
    return await createColleges(formData, logo, images);
  };

  return (
    <Layout>
      <CollegeForm mode="add" onSubmit={handleAdd} />
    </Layout>
  );
}
