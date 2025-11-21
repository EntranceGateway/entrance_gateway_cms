import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Layout from "../../../components/layout/layout";
import NoteForm from "./components/form.jsx/NotesFrom";
import STATUSES from "../../globals/status/statuses";

const CreateNote = () => {

  const handleNotes = (formData) => {
  };

 
  return (
    <Layout>
      <NoteForm onSubmit={handleNotes} />
    </Layout>
  );
};

export default CreateNote;
