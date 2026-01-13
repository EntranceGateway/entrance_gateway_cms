import React from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { createNote } from "../../http/notes";
import NoteForm from "./components/form/NotesFrom";

const CreateNote = () => {
  const location = useLocation();
  const syllabusId = location.state?.syllabusId || "";

  const handleAddNote = async (formData) => {
    return await createNote(formData);
  };

  return (
    <Layout>
      <NoteForm 
        mode="add" 
        onSubmit={handleAddNote}
        initialData={{ syllabusId }}
      />
    </Layout>
  );
};

export default CreateNote;
