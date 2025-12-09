import React, { useEffect, useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Layout from "../../../components/layout/Layout";

// PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfViewer = ({ noteId, token, fetchPdfBlob, className,suburl }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(800);
  const [errorMessage, setErrorMessage] = useState("");

  const pdfWrapperRef = useRef(null);

  // Handle responsive width
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
        if (!noteId || !token) return;

        const blob = await fetchPdfBlob(`${suburl}/${noteId}`, token);
        const fileURL = URL.createObjectURL(blob);
        setPdfUrl(fileURL);
      } catch (err) {
        console.error("PDF load error:", err);
        setErrorMessage(err.message || "Failed to load PDF");
      }
    };

    loadPdf();

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [noteId, token, fetchPdfBlob]);

  if (errorMessage) return <p className="text-red-600">{errorMessage}</p>;
  if (!pdfUrl) return <p className="text-gray-600">Loading PDF...</p>;

  return (
    <Layout>
    <div
      ref={pdfWrapperRef}
      className={className || "w-full h-full overflow-y-auto flex justify-center"}
      onContextMenu={(e) => e.preventDefault()} // disable right-click
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
            renderTextLayer={false}
            renderAnnotationLayer={false}
            onContextMenu={(e) => e.preventDefault()} // disable right-click
          />
        ))}
      </Document>
    </div>
    </Layout>
  );
};

export default PdfViewer;
