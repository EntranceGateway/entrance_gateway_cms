import React, { useEffect, useState, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc =
  `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Styled toolbar button
const ViewerButton = ({ icon: Icon, onClick, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded-full transition-colors ${
      disabled
        ? "text-gray-400 cursor-not-allowed"
        : "text-gray-600 hover:bg-gray-200 active:bg-gray-300"
    }`}
  >
    <Icon size={20} />
  </button>
);

const PdfViewer = ({ noteId, token, fetchPdfBlob, suburl, className }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageWidth, setPageWidth] = useState(800);
  const [isLoading, setIsLoading] = useState(true);

  const viewerRef = useRef(null);
  const pageWrapperRef = useRef(null);
  const pdfUrlRef = useRef(null);

  const STORAGE_KEY = `pdf_note_${noteId}`;

  /* ---------- Helpers ---------- */
  const blobToBase64 = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  const base64ToBlob = (base64) => {
    const parts = base64.split(",");
    const mime = parts[0].match(/:(.*?);/)[1];
    const binary = atob(parts[1]);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], { type: mime });
  };

  /* ---------- Load PDF ---------- */
  useEffect(() => {
    const loadPdf = async () => {
      setIsLoading(true);
      try {
        if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);

        const cached = localStorage.getItem(STORAGE_KEY);
        let blob;

        if (cached) {
          blob = base64ToBlob(cached);
        } else {
          blob = await fetchPdfBlob(`${suburl}/${noteId}`, token);
          const base64 = await blobToBase64(blob);
          localStorage.setItem(STORAGE_KEY, base64);
        }

        const url = URL.createObjectURL(blob);
        pdfUrlRef.current = url;
        setPdfUrl(url);
      } catch (err) {
        console.error("PDF load error:", err);
        setPdfUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadPdf();

    return () => {
      if (pdfUrlRef.current) URL.revokeObjectURL(pdfUrlRef.current);
    };
  }, [noteId, token, fetchPdfBlob, suburl]);

  /* ---------- Responsive Width ---------- */
  const calculatePageWidth = useCallback(() => {
    if (pageWrapperRef.current) {
      setPageWidth(pageWrapperRef.current.clientWidth - 16);
    }
  }, []);

  useEffect(() => {
    calculatePageWidth();
    window.addEventListener("resize", calculatePageWidth);
    return () => window.removeEventListener("resize", calculatePageWidth);
  }, [calculatePageWidth]);

  /* ---------- Navigation ---------- */
  const goToPrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goToNextPage = () => setCurrentPage((p) => Math.min(numPages, p + 1));

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        <Loader2 className="animate-spin mr-3" size={28} />
        Loading document...
      </div>
    );

  if (!pdfUrl)
    return (
      <p className="text-center py-10 text-xl font-semibold text-red-600">
        Failed to load PDF document.
      </p>
    );

  return (
    <div
      ref={viewerRef}
      className={`flex flex-col h-full bg-white pdf-viewer-container ${className || ""}`}
    >
      {/* Toolbar */}
      <div className="flex justify-center items-center p-3 bg-white border-b border-gray-200">
        <ViewerButton
          icon={ChevronLeft}
          onClick={goToPrevPage}
          disabled={currentPage <= 1}
        />
        <span className="mx-3 text-sm font-medium text-gray-700">
          Page <strong>{currentPage}</strong> / <strong>{numPages}</strong>
        </span>
        <ViewerButton
          icon={ChevronRight}
          onClick={goToNextPage}
          disabled={currentPage >= numPages}
        />
      </div>

      {/* PDF Content */}
      <div
        ref={pageWrapperRef}
        className="flex-1 flex flex-col items-center py-4 overflow-y-auto bg-gray-100"
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            setCurrentPage(1);
          }}
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={index}
              pageNumber={index + 1}
              width={pageWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-2xl mb-4"
            />
          ))}
        </Document>
      </div>
    </div>
  );
};

export default PdfViewer;
