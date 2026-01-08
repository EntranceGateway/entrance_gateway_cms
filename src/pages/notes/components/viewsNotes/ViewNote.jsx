import React from "react";
import { useParams } from "react-router-dom";
import { noteFile } from "../../../../http/fetchpdf";
import FileViewer from "../../../../components/FileViewer/FileViewer";
import Layout from "../../../../../components/layout/Layout";

const ViewNotePage = () => {
    const { id } = useParams();
  
  const token = localStorage.getItem("token");

  // Build the complete URL using the noteFile function
  const pdfUrl = noteFile(id);

  return (
    <Layout>
    <div className="w-full h-screen bg-gray-100 p-4">
      <FileViewer
        fileUrl={pdfUrl}
        token={token}
        fileName={`note-${id}`}
        className="h-full bg-white rounded-lg shadow-sm"
      />
    </div>
    </Layout>
  );
};

export default ViewNotePage;
