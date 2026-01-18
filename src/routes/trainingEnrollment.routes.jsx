import { lazy } from "react";

const TrainingEnrollmentPage = lazy(() => import("@/pages/admin/trainingEnrollment/TrainingEnrollmentPage"));
const ViewTrainingEnrollment = lazy(() => import("@/pages/admin/trainingEnrollment/ViewTrainingEnrollment"));

export const trainingEnrollmentRoutes = [
    { path: "/admin/training-enrollment", element: <TrainingEnrollmentPage /> },
    { path: "/admin/training-enrollment/view/:id", element: <ViewTrainingEnrollment /> },
];
