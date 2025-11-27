import React from "react";
import SyllabusForm from "./component/form/form";
import Layout from "../../../components/layout/Layout";

export default function AddSyllabusPage() {
  const token = localStorage.getItem("token");

  return (
    <Layout>
    <SyllabusForm
      mode="add"
      token={token}
    />
    </Layout>
  );
}
