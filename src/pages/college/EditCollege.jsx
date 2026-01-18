import CollegeForm from "./components/form/Form";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getSingle, updateColleges } from "../../http/colleges";
import Layout from "@/components/layout/Layout";

function EditCollege() {
  const { id } = useParams();

  const [collegeData, setCollegeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch single college
  const fetchCollege = async () => {
    try {
      const response = await getSingle(id);
      if (response.status === 200) {
        setCollegeData(response.data.data);
      } else {
        setError("College not found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch college data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollege();
  }, [id]);

  // Handle form submission (edit mode supports logo/images update)
  const handleUpdate = async (formData, logo, images) => {
    try {
      const res = await updateColleges(id, formData, logo, images);
      if (res.status === 200) {
        alert("College updated successfully");
      } else {
        alert("Failed to update college");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating college");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Layout>
      <CollegeForm
        mode="edit"
        initialData={collegeData}
        onSubmit={handleUpdate}
      />
    </Layout>
  );
}

export default EditCollege