import { lazy } from "react";

const Register = lazy(() => import("@/pages/admin/admin/Register"));
const Dashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AddTraning = lazy(() => import("@/pages/admin/training/AddTraining"));
const AdminProfile = lazy(() => import("@/pages/admin/AdminProfile"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));
const AdminUsers = lazy(() => import("@/pages/admin/users/AdminUsers"));
const AddAdmin = lazy(() => import("@/pages/admin/users/AddAdmin"));
const AuditLogs = lazy(() => import("@/pages/admin/audit/AuditLogs"));
const AddQuestion = lazy(() => import("@/pages/question/AddQuestion"));
const Navbar = lazy(() => import("@/components/navigation/Navbar"));

export const adminRoutes = [
    { path: "/", element: <Dashboard /> },
    { path: "/admin/profile", element: <AdminProfile /> },
    { path: "/admin/settings", element: <AdminSettings /> },
    { path: "/admin/users", element: <AdminUsers /> },
    { path: "/admin/users/add", element: <AddAdmin /> },
    { path: "/admin/audit-logs", element: <AuditLogs /> },
    { path: "/training/add", element: <AddTraning /> },
    { path: "/question/add", element: <AddQuestion /> },
    { path: "/navbar", element: <Navbar /> },
];
