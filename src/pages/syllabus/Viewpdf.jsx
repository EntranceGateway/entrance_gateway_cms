import React from "react";
import { useParams } from "react-router-dom";
import { getSingle, syllabusFile } from "../../http/fetchpdf";
import PdfViewer from "../../components/pdfview/PdfViewer";

const ViewSyllabus = () => {
    const { id } = useParams();
  
  const token = localStorage.getItem("token");

  return (
    <div className="w-full h-screen">
      <PdfViewer
        noteId={id}
        token={token}
        fetchPdfBlob={getSingle} // pass your reusable API function
        suburl={syllabusFile}
        className="w-full h-screen"
      />
    </div>
  );
};

export default ViewSyllabus;
