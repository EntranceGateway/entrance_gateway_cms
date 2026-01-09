import { lazy } from "react";

const AllOldQuestions = lazy(() => import("@/pages/oldQuestions/AllOldQuestions"));
const AddOldQuestion = lazy(() => import("@/pages/oldQuestions/AddOldQuestion"));
const EditOldQuestion = lazy(() => import("@/pages/oldQuestions/EditOldQuestion"));

export const oldQuestionRoutes = [
    { path: "/old-questions/all", element: <AllOldQuestions /> },
    { path: "/old-questions/add", element: <AddOldQuestion /> },
    { path: "/old-questions/edit/:id", element: <EditOldQuestion /> },
];
