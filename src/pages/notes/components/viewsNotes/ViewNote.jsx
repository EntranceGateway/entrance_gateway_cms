import React from "react";
import PdfViewer from "../../../../components/pdfview/PdfViewer";
import { getSingle, noteFile } from "../../../../http/fetchpdf";
import { useParams } from "react-router-dom";
import Layout from "../../../../../components/layout/Layout";

const ViewNotePage = () => {
    const { id } = useParams();
  
  const token = localStorage.getItem("token");

  return (
    <Layout>
    <div className="w-full h-screen">
      <PdfViewer
        noteId={id}
        token={token}
        fetchPdfBlob={getSingle} // pass your reusable API function
        suburl={noteFile}
        className="w-full h-screen"
      />
    </div>
    </Layout>
  );
};

export default ViewNotePage;
