import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import axios from "axios";
import Layout from "../../../../../components/layout/Layout";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Generic function to fetch binary PDF
const fetchPdfBlob = async (url, token) => {
  if (!token) throw new Error("Authentication token is missing");

  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/pdf",
    },
    responseType: "blob",
    withCredentials: true, // ✅ matches access-control-allow-credentials: true
  });

  if (res.status !== 200) {
    throw new Error(`Unexpected response status: ${res.status}`);
  }

  const contentType = res.headers["content-type"];
  if (!contentType || !contentType.includes("application/pdf")) {
    throw new Error("Invalid response: not a PDF file");
  }

  return res.data; // blob
};

const PdfViewer = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(800);
  const [errorMessage, setErrorMessage] = useState("");

  const pdfWrapperRef = useRef(null);

  // Update page width responsively
  useEffect(() => {
    const updateWidth = () => {
      if (pdfWrapperRef.current) {
        setPageWidth(pdfWrapperRef.current.clientWidth * 0.95);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

  // Fetch PDF blob
  useEffect(() => {
    const loadPdf = async () => {
      try {
        if (!id) return;

        const blob = await fetchPdfBlob(
          `http://185.177.116.173:8080/api/v1/notes/getNotefile/${id}`,
          token
        );

        const fileURL = URL.createObjectURL(blob);
        setPdfUrl(fileURL);
      } catch (err) {
        console.error("PDF load error:", err);
        setErrorMessage(err.message || "Failed to load PDF");
      }
    };

    loadPdf();

    // Cleanup object URL
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [id, token]);

  if (errorMessage)
    return <p className="text-red-600 text-center mt-4">{errorMessage}</p>;
  if (!pdfUrl)
    return <p className="text-gray-600 text-center mt-4">Loading PDF...</p>;

  return (
    <Layout>
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="w-full h-screen overflow-y-auto flex justify-center"
      ref={pdfWrapperRef}
    >
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading="Loading PDF..."
        error="Failed to load PDF"
        noData="No PDF file found"
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={pageWidth}
            renderTextLayer={false} // disable if you want better performance
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
    </div>
    </Layout>
  );
};

export default PdfViewer;
