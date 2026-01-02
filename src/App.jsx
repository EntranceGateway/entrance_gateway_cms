import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store/store";
import { Suspense, lazy } from "react";

import ProtectedRoute from "./Verification/ProtectedRoute";
import Spinner from "../components/Spinner/Spinner";
import useAxiosInterceptor from "../src/pages/login/axiosInterceptor"; 
import AdminProfile from "./pages/admin/AdminProfile";
import AdminSettings from "./pages/admin/AdminSettings";

// Import Quiz CSS
import "./quiz/quiz.css";

// Lazy load all pages
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminRegister = lazy(() => import("./pages/admin/admin/Register"));
const Login = lazy(() => import("./pages/login/Adminlogin"));
const AddTraning = lazy(() => import("./pages/admin/training/AddTraining"));

const CollegeForm = lazy(() => import("./pages/college/components/form/Form"));
const AddCollege = lazy(() => import("./pages/college/AddCollege"));
const EditCollege = lazy(() => import("./pages/college/EditCollege"));
const CollegeAll = lazy(() => import("./pages/college/CollegeAll"));
const AddCourseToCollege = lazy(() => import("./pages/college/AddCourseToCollege"));

const AddCourse = lazy(() => import("./pages/course/AddCourse"));
const EditCourse = lazy(() => import("./pages/course/EditCourse"));
const AllCourse = lazy(() => import("./pages/course/AllCourse"));

const CreateNote = lazy(() => import("./pages/notes/AddForm"));
const EditNote = lazy(() => import("./pages/notes/EditForm"));
const NotePage = lazy(() => import("./pages/notes/NotesPage"));
const ViewNote = lazy(() => import("./pages/notes/components/viewsNotes/ViewNote"));

const AddSyllabus = lazy(() => import("./pages/syllabus/AddSyllabus"));
const EditSyllabus = lazy(() => import("./pages/syllabus/EditSyllabus"));
const AllSyllabus = lazy(() => import("./pages/syllabus/AllSyllabus"));
const ViewSyllabus = lazy(() => import("./pages/syllabus/Viewpdf"));

const AddBanner = lazy(() => import("./Banner/Form/AddBanner"));
const AddCategory = lazy(() => import("./Category/CategoryForm/AddCategory"));
const Navbar = lazy(() => import("../components/navbar/Navbar"));

// Old Questions
const AllOldQuestions = lazy(() => import("./pages/oldQuestions/AllOldQuestions"));
const AddOldQuestion = lazy(() => import("./pages/oldQuestions/AddOldQuestion"));
const EditOldQuestion = lazy(() => import("./pages/oldQuestions/EditOldQuestion"));

// MCQ Questions
const AddQuestion = lazy(() => import("./pages/question/AddQuestion"));

// Quiz CMS Pages
const QuizDashboard = lazy(() => import("./quiz/pages/QuizDashboard"));
const QuizCategories = lazy(() => import("./quiz/pages/QuizCategories"));
const QuizCourses = lazy(() => import("./quiz/pages/QuizCourses"));
const QuizQuestionSets = lazy(() => import("./quiz/pages/QuizQuestionSets"));
const QuizQuestions = lazy(() => import("./quiz/pages/QuizQuestions"));
const QuizResults = lazy(() => import("./quiz/pages/QuizResults"));

// Wrapper to run interceptor inside Router
const AxiosInterceptorWrapper = ({ children }) => {
  useAxiosInterceptor();
  return children;
};

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AxiosInterceptorWrapper>
          <Suspense fallback={<Spinner />}>
            <Routes>

              {/* Public Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin/register" element={<AdminRegister />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>

                {/* Dashboard */}
                <Route path="/" element={<Dashboard />} />

                {/* College Routes */}
                <Route path="/college" element={<CollegeForm />} />
                <Route path="/college/add" element={<AddCollege />} />
                <Route path="/college/edit/:id" element={<EditCollege />} />
                <Route path="/college/all" element={<CollegeAll />} />
                <Route path="/college/:id/courses" element={<AddCourseToCollege />} />

              <Route path="/admin/profile" element={<AdminProfile />} />
              <Route path="/admin/settings" element={<AdminSettings />} />

                {/* Course Routes */}
                <Route path="/course/add" element={<AddCourse />} />
                <Route path="/course/edit/:id" element={<EditCourse />} />
                <Route path="/course/all" element={<AllCourse />} />

                {/* Notes Routes */}
                <Route path="/notes/add" element={<CreateNote />} />
                <Route path="/notes/add/:id" element={<CreateNote />} />
                <Route path="/notes/edit/:id" element={<EditNote />} />
                <Route path="/notespage" element={<NotePage />} />
                <Route path="/notes/viewnotes/:id" element={<ViewNote />} />

                {/* Syllabus Routes */}
                <Route path="/syllabus/add" element={<AddSyllabus />} />
                <Route path="/syllabus/add/:id" element={<AddSyllabus />} />
                <Route path="/syllabus/edit/:id" element={<EditSyllabus />} />
                <Route path="/syllabus/all" element={<AllSyllabus />} />
                <Route path="/syllabus/viewsyllabus/:id" element={<ViewSyllabus />} />

                {/* Training */}
                <Route path="/training/add" element={<AddTraning />} />

                {/* Banner & Category */}
                <Route path="/banner/add" element={<AddBanner />} />
                <Route path="/category/add" element={<AddCategory />} />

                {/* Old Questions */}
                <Route path="/old-questions/all" element={<AllOldQuestions />} />
                <Route path="/old-questions/add" element={<AddOldQuestion />} />
                <Route path="/old-questions/edit/:id" element={<EditOldQuestion />} />

                {/* MCQ Questions */}
                <Route path="/question/add" element={<AddQuestion />} />

                {/* Quiz CMS Routes */}
                <Route path="/quiz" element={<QuizDashboard />} />
                <Route path="/quiz/categories" element={<QuizCategories />} />
                <Route path="/quiz/courses" element={<QuizCourses />} />
                <Route path="/quiz/question-sets" element={<QuizQuestionSets />} />
                <Route path="/quiz/questions" element={<QuizQuestions />} />
                <Route path="/quiz/results" element={<QuizResults />} />

                {/* Navbar */}
                <Route path="/navbar" element={<Navbar />} />

              </Route>
            </Routes>
          </Suspense>
        </AxiosInterceptorWrapper>
      </BrowserRouter>
    </Provider>
  );
}
