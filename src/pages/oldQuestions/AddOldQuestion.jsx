import React from "react";

import Layout from "@/components/layout/Layout";
import OldQuestionForm from "./component/form/OldQuestionForm";
import { addOldQuestion } from "../../http/oldQuestionCollection";

const AddOldQuestion = () => {
  const handleAddOldQuestion = async (formData) => {
    try {
      const res = await addOldQuestion(formData);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  return (
    <Layout>
      <div className="p-6 flex justify-center bg-gray-50 min-h-screen">
        <div className="w-full max-w-2xl">
          <OldQuestionForm mode="add" onSubmit={handleAddOldQuestion} />
        </div>
      </div>
    </Layout>
  );
};

export default AddOldQuestion;
