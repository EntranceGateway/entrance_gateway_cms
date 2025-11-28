// src/pages/course/AddCourse.jsx

import Layout from "../../../components/layout/layout";
import { createCourse } from "../../http/course";
import CourseForm from "./component/form";

function AddCourse() {
  const handleSubmit = async (formData) => {
    const token = localStorage.getItem("token");

    try {
      // call create API — it already provides normalized error
      const res = await createCourse(formData, token);
      return res.data; // CourseForm will show success
    } catch (err) {
      // DO NOT rewrap -> just throw the normalized backend error
      throw err; 
    }
  };

  return (
    <Layout>
      <CourseForm mode="add" onSubmit={handleSubmit} />
    </Layout>
  );
}

export default AddCourse;
