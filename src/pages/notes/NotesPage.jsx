import Layout from "@/components/layout/Layout";
import NotesTable from "./components/notesTable/NotesTable";

const NotePage = () => {
  return (
    <Layout>

      <div className="p-6">

        <NotesTable />
      </div>
    </Layout>

  );
};

export default NotePage;
