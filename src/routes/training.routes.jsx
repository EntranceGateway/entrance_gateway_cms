import { lazy } from "react";

const TrainingPage = lazy(() => import("@/pages/admin/training/TrainingPage"));
const AddTraining = lazy(() => import("@/pages/admin/training/AddTraining"));
const EditTraining = lazy(() => import("@/pages/admin/training/EditTraining"));

export const trainingRoutes = [
    { path: "/admin/training", element: <TrainingPage /> },
    { path: "/admin/training/add", element: <AddTraining /> },
    { path: "/admin/training/edit/:id", element: <EditTraining /> },
];
