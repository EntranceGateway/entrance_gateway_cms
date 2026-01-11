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
      <OldQuestionForm mode="add" onSubmit={handleAddOldQuestion} />
    </Layout>
  );
};

export default AddOldQuestion;
