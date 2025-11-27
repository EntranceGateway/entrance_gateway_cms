import Layout from "../../../components/layout/layout";
import NoteForm from "./components/form.jsx/NotesFrom";
import { createNotes } from "../../http/notes";

const CreateNote = () => {
  const token = localStorage.getItem("token");

  const handleNotes = async (data) => {
    return await createNotes(data, token);
  };

  return (
    <Layout>
      <NoteForm mode="add" onSubmit={handleNotes} />
    </Layout>
  );
};

export default CreateNote;
