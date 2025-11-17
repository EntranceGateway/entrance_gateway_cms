import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import CollegeForm from "./college/components/form/Form";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/admin" element={<Dashboard/>}/>
        <Route path="/college" element={<CollegeForm/>}/>

      </Routes>
    </BrowserRouter>
  );
}
