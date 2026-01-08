import { lazy } from "react";

const BlogPage = lazy(() => import("@/pages/blog/BlogPage"));
const AddBlog = lazy(() => import("@/pages/blog/AddBlog"));
const EditBlog = lazy(() => import("@/pages/blog/EditBlog"));
const ViewBlog = lazy(() => import("@/pages/blog/ViewBlog"));

export const blogRoutes = [
    { path: "/blogs", element: <BlogPage /> },
    { path: "/blogs/add", element: <AddBlog /> },
    { path: "/blogs/edit/:id", element: <EditBlog /> },
    { path: "/blogs/view/:id", element: <ViewBlog /> },
];
