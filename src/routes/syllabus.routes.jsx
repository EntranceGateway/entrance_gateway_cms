import { lazy } from "react";

const AddSyllabus = lazy(() => import("@/pages/syllabus/AddSyllabus"));
const EditSyllabus = lazy(() => import("@/pages/syllabus/EditSyllabus"));
const AllSyllabus = lazy(() => import("@/pages/syllabus/AllSyllabus"));
const ViewSyllabus = lazy(() => import("@/pages/syllabus/Viewpdf"));

export const syllabusRoutes = [
    { path: "/syllabus/add", element: <AddSyllabus /> },
    { path: "/syllabus/add/:id", element: <AddSyllabus /> },
    { path: "/syllabus/edit/:id", element: <EditSyllabus /> },
    { path: "/syllabus/all", element: <AllSyllabus /> },
    { path: "/syllabus/viewsyllabus/:id", element: <ViewSyllabus /> },
];
