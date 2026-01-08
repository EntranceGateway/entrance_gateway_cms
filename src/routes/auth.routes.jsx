import { lazy } from "react";

const AdminRegister = lazy(() => import("@/pages/admin/admin/Register"));
const Login = lazy(() => import("@/pages/login/Adminlogin"));

export const authRoutes = [
    { path: "/admin/login", element: <Login /> },
    { path: "/admin/register", element: <AdminRegister /> },
];
