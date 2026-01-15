import { lazy } from "react";

const TrainingPage = lazy(() => import("@/pages/admin/training/TrainingPage"));
const AddTraining = lazy(() => import("@/pages/admin/training/AddTraining"));
const EditTraining = lazy(() => import("@/pages/admin/training/EditTraining"));

const ViewTraining = lazy(() => import("@/pages/admin/training/ViewTraining"));

export const trainingRoutes = [
    { path: "/admin/training", element: <TrainingPage /> },
    { path: "/admin/training/add", element: <AddTraining /> },
    { path: "/admin/training/edit/:id", element: <EditTraining /> },
    { path: "/admin/training/view/:id", element: <ViewTraining /> },
];
