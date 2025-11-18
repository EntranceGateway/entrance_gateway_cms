import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import CollegeForm from "./college/components/form/Form";
import CreateNote from "./notes/AddForm";
import NotesPage from "./notes/NotesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Dashboard/>}/>
        <Route path="/college" element={<CollegeForm/>}/>
        <Route path="/notes/add" element={<CreateNote/>}/>
        <Route path="/notespage" element={<NotesPage/>}/>

      </Routes>
    </BrowserRouter>
  );
}
