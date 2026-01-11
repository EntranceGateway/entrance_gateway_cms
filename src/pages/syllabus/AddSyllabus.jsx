import React from "react";
import Layout from "@/components/layout/Layout";
import tokenService from "../../auth/services/tokenService";
import SyllabusForm from "./component/form/form";
import { addSyllabus } from "../../http/syllabus";

const AddSyllabusPage = () => {
  const handleAddSyllabus = async (formData) => {
    try {
      const res = await addSyllabus(formData);
      // Optionally return success message
      return res.data;
    } catch (err) {
      // Throw error to SyllabusForm for field-level handling
      throw err;
    }
  };

  return (
    <Layout>
      <SyllabusForm mode="add" onSubmit={handleAddSyllabus} />
    </Layout>
  );
};

export default AddSyllabusPage;
