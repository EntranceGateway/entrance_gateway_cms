import { lazy } from "react";

const CreateNote = lazy(() => import("@/pages/notes/AddForm"));
const EditNote = lazy(() => import("@/pages/notes/EditForm"));
const NotePage = lazy(() => import("@/pages/notes/NotesPage"));
const ViewNote = lazy(() => import("@/pages/notes/components/viewsNotes/ViewNote"));

export const notesRoutes = [
    { path: "/notes/add", element: <CreateNote /> },
    { path: "/notes/add/:id", element: <CreateNote /> },
    { path: "/notes/edit/:id", element: <EditNote /> },
    { path: "/notespage", element: <NotePage /> },
    { path: "/notes/viewnotes/:id", element: <ViewNote /> },
];
