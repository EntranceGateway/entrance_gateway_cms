import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store/store";

import Dashboard from "./pages/admin/Dashboard";
import CollegeForm from "./pages/college/components/form/Form";
import CreateNote from "./pages/notes/AddForm";
import NotePage from "./pages/notes/NotesPage";
import AddTraning from "./pages/admin/training/AddTraining";
import AddCollege from "./pages/college/AddCollege";
import AddCourse from "./pages/course/AddCourse";
import AddQuestion from "./pages/question/AddQuestion";
import AddSyllabus from "./pages/syllabus/AddSyllabus";
import AdminRegister from "./pages/admin/admin/Register";
import Login from "./pages/login/Adminlogin";
import ProtectedRoute from "./Verification/ProtectedRoute";
import AllCourse from "./pages/course/AllCourse";
import CollegeAll from "./pages/college/CollegeAll";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>

          {/* Public routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/college" element={<CollegeForm />} />
            <Route path="/notes/add" element={<CreateNote />} />
            <Route path="/notespage" element={<NotePage />} />
            <Route path="/training/add" element={<AddTraning />} />
            <Route path="/college/add" element={<AddCollege />} />
            <Route path="/college/all" element={<CollegeAll/>}/>
            <Route path="/course/add" element={<AddCourse />} />
            <Route path="/question/add" element={<AddQuestion />} />
            <Route path="/syllabus/add" element={<AddSyllabus />} />
            <Route path="/course/all" element={<AllCourse/>}/>
          </Route>

        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
