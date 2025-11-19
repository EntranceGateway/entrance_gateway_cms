import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Layout from "../../../components/layout/layout";
import NoteForm from "./components/form.jsx/NotesFrom";
import { addNotes } from "../../../store/noteSlice";
import STATUSES from "../../globals/status/statuses";

const CreateNote = () => {
  const { status, data, token } = useSelector((state) => state.notes);
  const dispatch = useDispatch();

  const handleNotes = (formData) => {
    dispatch(addNotes(formData)); //  dispatch
  };

  // Watch for success
  useEffect(() => {
    if (status === STATUSES.SUCCESS) {
      console.log("Note added successfully");
      // optionally clear form, redirect, or show toast
    }
  }, [status]);

  return (
    <Layout>
      <NoteForm onSubmit={handleNotes} />
    </Layout>
  );
};

export default CreateNote;
