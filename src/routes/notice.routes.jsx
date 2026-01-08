import { lazy } from "react";

const NoticePage = lazy(() => import("@/pages/notice/NoticePage"));
const AddNotice = lazy(() => import("@/pages/notice/AddNotice"));
const EditNotice = lazy(() => import("@/pages/notice/EditNotice"));
const ViewNotice = lazy(() => import("@/pages/notice/ViewNotice"));

export const noticeRoutes = [
    { path: "/notices/all", element: <NoticePage /> },
    { path: "/notices/add", element: <AddNotice /> },
    { path: "/notices/edit/:id", element: <EditNotice /> },
    { path: "/notices/view/:id", element: <ViewNotice /> },
];
