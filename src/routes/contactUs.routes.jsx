import { lazy } from "react";

const ContactUsTable = lazy(() => import("@/pages/admin/contactUs/ContactUsTable"));
const ViewContactMessage = lazy(() => import("@/pages/admin/contactUs/ViewContactMessage"));

export const contactUsRoutes = [
  { path: "/admin/contact-us", element: <ContactUsTable /> },
  { path: "/admin/contact-us/view/:id", element: <ViewContactMessage /> },
];
