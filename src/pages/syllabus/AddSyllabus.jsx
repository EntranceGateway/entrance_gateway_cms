// src/pages/syllabus/AddSyllabus.jsx
import React, { useState } from "react";
import { addSyllabus } from "../../http/syllabus";
import Layout from "../../../components/layout/layout";
import SyllabusForm from "./component/form/form";

const AddSyllabusPage = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (formData) => {
    setMessage(""); // clear old messages
    const token = localStorage.getItem("token");

    try {
      const res = await addSyllabus(formData, token);
      const msg = res?.data?.message || "Syllabus added successfully!";
      setMessage(msg); // show success on page
      return res.data;  // also pass to SyllabusForm
    } catch (err) {
      const errMsg =
        err?.response?.data?.message || "Failed to add syllabus. Please try again.";
      setMessage(errMsg); // show error on page
      throw err; // pass to form for field-level handling
    }
  };

  return (
    <Layout>
      <div className="p-6 flex justify-center bg-gray-50">
        <div className="w-full max-w-2xl">
          {message && (
            <p
              className={`font-semibold mb-4 ${
                message.toLowerCase().includes("success")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <SyllabusForm mode="add" onSubmit={handleSubmit} />
        </div>
      </div>
    </Layout>
  );
};

export default AddSyllabusPage;
