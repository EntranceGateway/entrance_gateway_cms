import React from "react";
import { useParams } from "react-router-dom";
import { syllabusFile } from "../../http/fetchpdf";
import FileViewer from "@/components/pdf/FileViewer";

const ViewSyllabus = () => {
  const { id } = useParams();

  const pdfUrl = syllabusFile(id);

  return (
    <div className="w-full h-screen bg-gray-100">
      <FileViewer
        fileUrl={pdfUrl}
        fileName={`syllabus-${id}`}
        className="w-full h-screen"
      />
    </div>
  );
};

export default ViewSyllabus;
