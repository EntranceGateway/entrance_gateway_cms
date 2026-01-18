import { lazy } from "react";

const CollegeForm = lazy(() => import("@/pages/college/components/form/Form"));
const AddCollege = lazy(() => import("@/pages/college/AddCollege"));
const EditCollege = lazy(() => import("@/pages/college/EditCollege"));
const ViewCollege = lazy(() => import("@/pages/college/ViewCollege"));
const CollegeAll = lazy(() => import("@/pages/college/CollegeAll"));
const AddCourseToCollege = lazy(() => import("@/pages/college/AddCourseToCollege"));

export const collegeRoutes = [
    { path: "/college", element: <CollegeForm /> },
    { path: "/college/add", element: <AddCollege /> },
    { path: "/college/edit/:id", element: <EditCollege /> },
    { path: "/college/view/:id", element: <ViewCollege /> },
    { path: "/college/all", element: <CollegeAll /> },
    { path: "/college/:id/courses", element: <AddCourseToCollege /> },
];
