import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getSingleCourse, updateCourse } from "../../http/course";
import CourseForm from "./component/form";
import Layout from "@/components/layout/Layout";

export default function EditCourse() {
  const { id } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch single course data by id
  const fetchCourse = async () => {
    try {
      const response = await getSingleCourse(id);

      if (response.status === 200) {
        setCourseData(response.data.data);
      } else {
        setError("Course not found");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch course data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  // Update handler
  const handleUpdate = async (formData) => {
    try {
      const res = await updateCourse(id, formData);

      if (res.status === 200) {
        alert("Course updated successfully!");
      } else {
        alert("Failed to update course.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating course.");
    }
  };

  if (loading) return <p className="text-center py-5">Loading...</p>;
  if (error) return <p className="text-center text-red-600 py-5">{error}</p>;

  return (
    <Layout>
      <CourseForm
        mode="edit"
        initialData={courseData}
        onSubmit={handleUpdate}
      />
    </Layout>
  );
}
