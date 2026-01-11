import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import OldQuestionForm from "./component/form/OldQuestionForm";
import { updateOldQuestion, getAllOldQuestions } from "../../http/oldQuestionCollection";

const EditOldQuestion = () => {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchOldQuestion = async () => {
      try {
        // Fetch with large size to ensure we find the item (since getById is not available)
        const res = await getAllOldQuestions({ size: 1000 });
        const data = res.data.content || res.data.data?.content || [];
        
        // Ensure ID comparison handles string vs number
        const question = data.find((q) => String(q.id) === id);
        
        if (question) setInitialData(question);
        else setError("Old question not found");
      } catch (err) {
        console.error("Error fetching old question:", err);
        setError("Failed to load old question data");
      }
      setLoading(false);
    };
    fetchOldQuestion();
  }, [id]);

  const handleUpdateOldQuestion = async (formData) => {
    try {
      const res = await updateOldQuestion(id, formData);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  if (loading) return <Layout><div className="flex items-center justify-center min-h-screen">Loading...</div></Layout>;
  if (error) return <Layout><div className="flex items-center justify-center min-h-screen text-red-600">{error}</div></Layout>;

  return (
    <Layout>
      <OldQuestionForm
        mode="edit"
        initialData={initialData}
        onSubmit={handleUpdateOldQuestion}
      />
    </Layout>
  );
};

export default EditOldQuestion;
