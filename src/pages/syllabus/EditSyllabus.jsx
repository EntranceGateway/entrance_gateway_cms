import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SyllabusForm from "./component/form/form";
import { getSyllabusById, updateSyllabus } from "../../http/syllabus";

const EditSyllabus = () => {
  const { id } = useParams();

  const [syllabus, setSyllabus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // -------------------------------
  // Load syllabus data
  // -------------------------------
  const loadSyllabus = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await getSyllabusById(id);
      const data = res?.data?.data;

      if (!data) throw new Error("No syllabus data found");

      setSyllabus({
        courseId: data.courseId || "",
        courseCode: data.courseCode || "",
        subjectName: data.subjectName || "",
        syllabusTitle: data.syllabusTitle || "",
        creditHours: data.creditHours != null ? String(data.creditHours) : "",
        lectureHours: data.lectureHours != null ? String(data.lectureHours) : "",
        practicalHours: data.practicalHours != null ? String(data.practicalHours) : "",
        semester: data.semester || "",
        year: data.year != null ? String(data.year) : "",
        fileUrl: data.fileUrl || "",
        syllabusFile: null,
      });
    } catch (err) {
      console.error("Load syllabus error:", err);
      setError(err?.message || "Failed to load syllabus data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSyllabus();
  }, [id, token]);

  // -------------------------------
  // Handle form update
  // -------------------------------
  const handleUpdate = async (formData) => {
    setError("");
    setSuccess("");

    try {
      let syllabusJson = {};
      let file = null;

      if (formData instanceof FormData) {
        const syllabusBlob = formData.get("syllabus");
        file = formData.get("file");

        if (syllabusBlob) syllabusJson = JSON.parse(await syllabusBlob.text());
      } else {
        syllabusJson = formData;
      }

      // Update JSON fields
      if (Object.keys(syllabusJson).length > 0) {
        await updateSyllabus(id, syllabusJson);
      }

      // Update file if provided
      if (file) {
        await updateSyllabus(id, formData); // send FormData with file
      }

      await loadSyllabus();
      setSuccess("Syllabus updated successfully!");
    } catch (err) {
      console.error("Update syllabus error:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to update syllabus.");
    }
  };

  // -------------------------------
  // Loading / Error state
  // -------------------------------
  if (loading) return <p className="text-center mt-10 text-gray-600">Loading syllabus...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  // -------------------------------
  // Render form
  // -------------------------------
  return (
    <Layout>
      {success && (
        <p className="text-center mb-4 text-green-600 font-medium">{success}</p>
      )}
      <SyllabusForm
        mode="edit"
        initialData={syllabus}
        onSubmit={handleUpdate}
      />
    </Layout>
  );
};

export default EditSyllabus;
