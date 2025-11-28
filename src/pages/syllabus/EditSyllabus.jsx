import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getSyllabusById, updateSyllabus } from "../../http/syllabus";
import Layout from "../../../components/layout/layout";
import SyllabusForm from "./component/form/form";


function EditSyllabus() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [syllabusData, setSyllabusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch single syllabus
  const fetchSyllabus = async () => {
    try {
      const response = await getSyllabusById(id, token);

      if (response.status === 200) {
        setSyllabusData(response.data.data);
      } else {
        setError("Syllabus not found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch syllabus data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabus();
  }, [id]);


  // Handle update submit
  const handleUpdate = async (formData) => {
    try {
      const res = await updateSyllabus(id, formData, token);

      if (res.status === 200) {
        alert("Syllabus updated successfully");
      } else {
        alert("Failed to update syllabus");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating syllabus");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Layout>
      <SyllabusForm
        mode="edit"
        initialData={syllabusData}
        onSubmit={handleUpdate}
      />
    </Layout>
  );
}

export default EditSyllabus;
