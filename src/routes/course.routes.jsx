import { lazy } from "react";

const AddCourse = lazy(() => import("@/pages/course/AddCourse"));
const EditCourse = lazy(() => import("@/pages/course/EditCourse"));
const AllCourse = lazy(() => import("@/pages/course/AllCourse"));

export const courseRoutes = [
    { path: "/course/add", element: <AddCourse /> },
    { path: "/course/edit/:id", element: <EditCourse /> },
    { path: "/course/all", element: <AllCourse /> },
];
