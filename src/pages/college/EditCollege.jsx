import CollegeForm from "./components/form/Form";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getSingle, updateColleges } from "../../http/colleges";
import Layout from "../../../components/layout/Layout";

 function EditCollege() {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [collegeData, setCollegeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch single college
  const fetchCollege = async () => {
    try {
      const response = await getSingle(id, token);
      if (response.status === 200) {
        setCollegeData(response.data.data);
        console.log("shiva")
        console.log(collegeData) // assuming API sends data in response.data
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

  // Handle form submission
  const handleUpdate = async (data) => {
    try {
      const res = await updateColleges(id, data, token);
      if (res.status === 200) {
        alert("College updated successfully");
        // optionally redirect or update UI
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