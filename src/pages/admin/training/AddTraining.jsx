import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/common/PageHeader";
import TrainingForm from "./component/form/form";
import { GraduationCap } from "lucide-react";

function AddTraining() {
    return (
        <Layout>
             <PageHeader
                title="Create New Training"
                subtitle="Schedule a new training session or workshop"
                breadcrumbs={[
                    { label: "Training", path: "/admin/training" },
                    { label: "Create Training" },
                ]}
                icon={GraduationCap}
            />
            <TrainingForm />
        </Layout>
    );
}

export default AddTraining;