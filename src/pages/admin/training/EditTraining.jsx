import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/common/PageHeader";
import TrainingForm from "./component/form/TrainingForm";
import { getTrainingById, updateTraining } from "@/http/training";
import { FormSkeleton } from "@/components/loaders";
import { GraduationCap } from "lucide-react";
import toast from "react-hot-toast";

const EditTraining = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const res = await getTrainingById(id);
        setTraining(res.data.data || res.data);
      } catch (err) {
        setError(err.message || "Failed to load training");
      } finally {
        setLoading(false);
      }
    };

    fetchTraining();
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      await updateTraining(id, data);
      toast.success("Training updated successfully!");
      navigate("/admin/training");
    } catch (error) {
      toast.error(error.message || "Failed to update training");
      throw error;
    }
  };

  if (loading) {
    return (
      <Layout>
        <FormSkeleton />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="Edit Training"
        subtitle="Update training program details"
        breadcrumbs={[
          { label: "Training", to: "/admin/training" },
          { label: "Edit Training" },
        ]}
        icon={GraduationCap}
      />
      <TrainingForm mode="edit" initialData={training} onSubmit={handleSubmit} />
    </Layout>
  );
};

export default EditTraining;
