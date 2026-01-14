import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/common/PageHeader";
import TrainingForm from "./component/form/TrainingForm";
import { GraduationCap } from "lucide-react";
import { useCreateTraining } from "@/hooks/useTraining";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AddTraining() {
    const navigate = useNavigate();
    const createMutation = useCreateTraining();

    const handleSubmit = async (data) => {
        try {
            await createMutation.mutateAsync(data);
            toast.success("Training created successfully!");
            navigate("/admin/training");
        } catch (error) {
            toast.error(error.message || "Failed to create training");
            throw error;
        }
    };

    return (
        <Layout>
             <PageHeader
                title="Create New Training"
                subtitle="Schedule a new training session or workshop"
                breadcrumbs={[
                    { label: "Training", to: "/admin/training" },
                    { label: "Create Training" },
                ]}
                icon={GraduationCap}
            />
            <TrainingForm mode="add" onSubmit={handleSubmit} />
        </Layout>
    );
}

export default AddTraining;