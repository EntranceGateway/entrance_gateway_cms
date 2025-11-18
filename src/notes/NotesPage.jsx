import Layout from "../../components/layout/layout";
import NotesTable from "./components/notesTable/NotesTable";

const NotesPage = () => {
  return (
    <Layout>

    <div className="p-6">

    <NotesTable />
       </div>
           </Layout> 

  );
};

export default NotesPage;
