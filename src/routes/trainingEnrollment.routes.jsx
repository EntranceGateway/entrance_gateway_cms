import { lazy } from "react";

const TrainingEnrollmentPage = lazy(() => import("@/pages/admin/trainingEnrollment/TrainingEnrollmentPage"));

export const trainingEnrollmentRoutes = [
    { path: "/admin/training-enrollment", element: <TrainingEnrollmentPage /> },
];
