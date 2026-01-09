// src/pages/course/AddCourse.jsx

import Layout from "@/components/layout/Layout";
import { createCourse } from "../../http/course";
import CourseForm from "./component/form";

function AddCourse() {
  const handleSubmit = async (formData) => {
    try {
      // call create API — it already provides normalized error
      const res = await createCourse(formData);
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
