import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Layout from "@/components/layout/Layout";
import NoteForm from "./components/form/NotesFrom";
import {
  getNotesById,
  getSingle,
  updateNoteDetails,
  updateNoteFile,
} from "../../http/notes";

const EditNote = () => {
  const { id } = useParams();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // -------------------------------
  // Load note JSON + file
  // -------------------------------
  const loadNote = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const [jsonRes, fileRes] = await Promise.all([
        getNotesById(id),
        getSingle(id).catch(() => ({ data: { data: { fileUrl: "" } } })),
      ]);

      const details = jsonRes?.data?.data;
      const fileData = fileRes?.data?.data;

      if (!details) throw new Error("No note data found");

      setNote({
        noteName: details.noteName || "",
        noteDescription: details.noteDescription || "",
        syllabusId: details.syllabusId || "",
        fileUrl: fileData?.fileUrl || "",
      });
    } catch (err) {
      console.error("Load note error:", err);
      setError(err?.message || "Failed to load note data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNote();
  }, [id]);

  // -------------------------------
  // Handle form update
  // -------------------------------
  const handleUpdate = async (formData) => {
    setError("");
    setSuccess("");

    try {
      let noteJson = {};
      let file = null;

      if (formData instanceof FormData) {
        const noteBlob = formData.get("note");
        file = formData.get("file");

        if (noteBlob) noteJson = JSON.parse(await noteBlob.text());
      } else {
        noteJson = formData;
      }

      // Update JSON fields
      if (Object.keys(noteJson).length > 0) {
        await updateNoteDetails(id, noteJson);
      }

      // Update file if provided
      if (file) {
        await updateNoteFile(id, file);
      }

      await loadNote();
      setSuccess("Note updated successfully!");

    } catch (err) {
      console.error("Update note error:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to update note.");
    }
  };

  // -------------------------------
  // Loading / Error state
  // -------------------------------
  if (loading) return <p className="text-center mt-10 text-gray-600">Loading note...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  // -------------------------------
  // Render form
  // -------------------------------
  return (
    <Layout>
      <NoteForm
        mode="edit"
        initialData={note}
        onSubmit={handleUpdate}
      />
    </Layout>



  );
};

export default EditNote;
