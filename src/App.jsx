import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store/store";

import ProtectedRoute from "./Verification/ProtectedRoute";

// Admin
import Dashboard from "./pages/admin/Dashboard";
import AdminRegister from "./pages/admin/admin/Register";
import Login from "./pages/login/Adminlogin";
import AddTraning from "./pages/admin/training/AddTraining";

// College
import CollegeForm from "./pages/college/components/form/Form";
import AddCollege from "./pages/college/AddCollege";
import EditCollege from "./pages/college/EditCollege";
import CollegeAll from "./pages/college/CollegeAll";

// Course
import AddCourse from "./pages/course/AddCourse";
import EditCourse from "./pages/course/EditCourse";
import AllCourse from "./pages/course/AllCourse";

// Notes
import CreateNote from "./pages/notes/AddForm";
import EditNote from "./pages/notes/EditForm";
import NotePage from "./pages/notes/NotesPage";
import ViewNote from "./pages/notes/components/viewsNotes/ViewNote";

// Syllabus
import AddSyllabus from "./pages/syllabus/AddSyllabus";
import EditSyllabus from "./pages/syllabus/EditSyllabus";
import AllSyllabus from "./pages/syllabus/AllSyllabus";
import ViewSyllabus from "./pages/syllabus/Viewpdf";

// Banner & Category
import AddBanner from "./Banner/Form/AddBanner";
import AddCategory from "./Category/CategoryForm/AddCategory";
import Navbar from "../components/navbar/Navbar";

// Other


export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>

          {/* --------------------
              Public Routes
          -------------------- */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* --------------------
              Protected Routes
          -------------------- */}
          <Route element={<ProtectedRoute />}>

            {/* Dashboard */}
            <Route path="/" element={<Dashboard />} />

            {/* College Routes */}
            <Route path="/college" element={<CollegeForm />} />
            <Route path="/college/add" element={<AddCollege />} />
            <Route path="/college/edit/:id" element={<EditCollege />} />
            <Route path="/college/all" element={<CollegeAll />} />

            {/* Course Routes */}
            <Route path="/course/add" element={<AddCourse />} />
            <Route path="/course/edit/:id" element={<EditCourse />} />
            <Route path="/course/all" element={<AllCourse />} />

            {/* Notes Routes */}
            <Route path="/notes/add" element={<CreateNote />} />
            <Route path="/notes/edit/:id" element={<EditNote />} />
            <Route path="/notespage" element={<NotePage />} />
            <Route path="/notes/viewnotes/:id" element={<ViewNote />} />

            {/* Syllabus Routes */}
            <Route path="/syllabus/add" element={<AddSyllabus />} />
            <Route path="/syllabus/edit/:id" element={<EditSyllabus />} />
            <Route path="/syllabus/all" element={<AllSyllabus />} />
            <Route path="/syllabus/viewsyllabus/:id" element={<ViewSyllabus />} />

            {/* Training */}
            <Route path="/training/add" element={<AddTraning />} />

            {/* Banner & Category */}
            <Route path="/banner/add" element={<AddBanner />} />
            <Route path="/category/add" element={<AddCategory />} />

            {/* Other */}
            <Route path="/navbar" element={<Navbar />} />

          </Route>

        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
