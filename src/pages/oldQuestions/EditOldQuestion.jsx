import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../../components/layout/Layout";
import OldQuestionForm from "./component/form/OldQuestionForm";
import { updateOldQuestion, getOldQuestions } from "../../http/oldQuestionCollection";

const EditOldQuestion = () => {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOldQuestion = async () => {
      try {
        // Fetch the old question data
        // Note: You may need a specific endpoint to get a single old question by ID
        // For now, we'll try to get it from the list endpoint with a filter
        const res = await getOldQuestions({}, token);
        const data = res.data.content || res.data.data?.content || [];
        const question = data.find((q) => q.id === id);
        
        if (question) {
          setInitialData(question);
        } else {
          setError("Old question not found");
        }
      } catch (err) {
        console.error("Error fetching old question:", err);
        setError("Failed to load old question data");
      }
      setLoading(false);
    };

    fetchOldQuestion();
  }, [id, token]);

  const handleUpdateOldQuestion = async (formData) => {
    try {
      const res = await updateOldQuestion(id, formData, token);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 flex justify-center bg-gray-50 min-h-screen">
        <div className="w-full max-w-2xl">
          <OldQuestionForm
            mode="edit"
            initialData={initialData}
            onSubmit={handleUpdateOldQuestion}
          />
        </div>
      </div>
    </Layout>
  );
};

export default EditOldQuestion;
