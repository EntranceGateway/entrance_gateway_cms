import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import CollegeForm from "./pages/college/components/form/Form";
import CreateNote from "./pages/notes/AddForm";
import NotePage from "./pages/notes/NotesPage";
import { Provider } from "react-redux";
import store from "../store/store"
import AddTraning from "./pages/admin/training/AddTraining";
export default function App() {
  return (
  <Provider store={store}>
      <BrowserRouter>
      <Routes>

        <Route path="/" element={<Dashboard/>}/>
        <Route path="/college" element={<CollegeForm/>}/>
        <Route path="/notes/add" element={<CreateNote/>}/>
        <Route path="/notespage" element={<NotePage/>}/>
        <Route path="/traning/add" element={<AddTraning/>}/>
      </Routes>
    </BrowserRouter>
  </Provider>
  );
}
