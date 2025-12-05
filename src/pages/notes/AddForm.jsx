import React from "react";
import Layout from "../../../components/layout/Layout";
import { createNote } from "../../http/notes";
import NoteForm from "./components/form.jsx/NotesFrom";

const CreateNote = () => {
  const token = localStorage.getItem("token");

  const handleAddNote = async (formData) => {
    return await createNote(formData, token);
  };

  return (
    <Layout>
      <NoteForm mode="add" onSubmit={handleAddNote} />
    </Layout>
  );
};

export default CreateNote;
