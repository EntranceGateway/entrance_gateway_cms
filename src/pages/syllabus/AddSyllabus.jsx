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
      <div className="p-6 flex justify-center bg-gray-50">
        <div className="w-full max-w-2xl">
          <SyllabusForm mode="add" onSubmit={handleAddSyllabus} />
        </div>
      </div>
    </Layout>
  );
};

export default AddSyllabusPage;
