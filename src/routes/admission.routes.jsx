import { lazy } from "react";

const AdmissionPage = lazy(() => import("@/pages/admin/admission/AdmissionPage"));
const ViewAdmission = lazy(() => import("@/pages/admin/admission/ViewAdmission"));

export const admissionRoutes = [
    { path: "/admin/admission", element: <AdmissionPage /> },
    { path: "/admin/admission/view/:id", element: <ViewAdmission /> },
];
