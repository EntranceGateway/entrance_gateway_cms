import React, { useEffect, useState, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, AlertCircle } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// IndexedDB configuration
const DB_NAME = "PdfCacheDB";
const DB_VERSION = 1;
const STORE_NAME = "pdfs";

/* ---------- IndexedDB Helpers ---------- */
const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("timestamp", "timestamp", { unique: false });
      }
    };
  });
};

const getCachedPdf = async (noteId) => {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(noteId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        if (result && result.blob) {
          resolve(result.blob);
        } else {
          resolve(null);
        }
      };
    });
  } catch (error) {
    console.warn("IndexedDB read error:", error);
    return null;
  }
};

const cachePdf = async (noteId, blob) => {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({
        id: noteId,
        blob: blob,
        timestamp: Date.now(),
      });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.warn("IndexedDB write error:", error);
  }
};

// Clean up old cached PDFs (older than 7 days)
const cleanupOldCache = async () => {
  try {
    const db = await openDatabase();
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("timestamp");
    const range = IDBKeyRange.upperBound(sevenDaysAgo);

    index.openCursor(range).onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        store.delete(cursor.primaryKey);
        cursor.continue();
      }
    };
  } catch (error) {
    console.warn("Cache cleanup error:", error);
  }
};

const PdfViewer = ({
  noteId,
  token,
  fetchPdfBlob,
  suburl,
  className,
  enableOfflineCache = false, // Only cache if explicitly enabled
}) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageWidth, setPageWidth] = useState(800);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadProgress, setLoadProgress] = useState(0);

  const viewerRef = useRef(null);
  const pageWrapperRef = useRef(null);
  const pdfUrlRef = useRef(null);
  const currentPageRef = useRef(currentPage);
  const numPagesRef = useRef(numPages);

  // Keep refs in sync with state
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    numPagesRef.current = numPages;
  }, [numPages]);

  /* ---------- Load PDF via Streaming ---------- */
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const loadPdf = async () => {
      setIsLoading(true);
      setError(null);
      setLoadProgress(0);

      try {
        // Revoke previous URL
        if (pdfUrlRef.current) {
          URL.revokeObjectURL(pdfUrlRef.current);
          pdfUrlRef.current = null;
        }

        let blob = null;

        // Try IndexedDB cache first (if offline caching is enabled)
        if (enableOfflineCache) {
          blob = await getCachedPdf(noteId);
          if (blob && isMounted) {
            setLoadProgress(100);
          }
        }

        // If not cached, fetch via streaming
        if (!blob) {
          blob = await fetchPdfBlob(`${suburl}/${noteId}`, token);

          if (!isMounted) return;

          // Validate blob
          if (!blob || blob.size === 0) {
            throw new Error("Received empty PDF response");
          }

          // Cache in IndexedDB for offline use (if enabled)
          if (enableOfflineCache) {
            await cachePdf(noteId, blob);
            // Run cleanup periodically
            cleanupOldCache();
          }
        }

        if (!isMounted) return;

        // Create object URL for react-pdf
        const url = URL.createObjectURL(blob);
        pdfUrlRef.current = url;
        setPdfUrl(url);
        setLoadProgress(100);
      } catch (err) {
        console.error("PDF load error:", err);
        if (isMounted) {
          setError(err.message || "Failed to load PDF document");
          setPdfUrl(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
      abortController.abort();
      if (pdfUrlRef.current) {
        URL.revokeObjectURL(pdfUrlRef.current);
        pdfUrlRef.current = null;
      }
    };
  }, [noteId, token, fetchPdfBlob, suburl, enableOfflineCache]);

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
  const goToPrevPage = useCallback(() => {
    setCurrentPage((p) => {
      const newPage = Math.max(1, p - 1);
      currentPageRef.current = newPage;
      return newPage;
    });
  }, []);
  
  const goToNextPage = useCallback(() => {
    setCurrentPage((p) => {
      const newPage = Math.min(numPagesRef.current, p + 1);
      currentPageRef.current = newPage;
      return newPage;
    });
  }, []);

  /* ---------- Scroll/Wheel-based Navigation ---------- */
  useEffect(() => {
    const wrapper = pageWrapperRef.current;
    if (!wrapper) return;

    let lastPageChangeTime = 0;
    const pageChangeCooldown = 400;
    let accumulatedDelta = 0;
    const deltaThreshold = 100;
    let lastWheelTime = 0;

    const handleWheel = (e) => {
      const pages = numPagesRef.current;
      const page = currentPageRef.current;
      
      if (pages === 0) return;
      
      const now = Date.now();
      const { scrollTop, scrollHeight, clientHeight } = wrapper;
      
      // Check if content is scrollable
      const isScrollable = scrollHeight > clientHeight + 10;
      const isAtTop = scrollTop <= 5;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
      
      // Reset accumulated delta if there's a pause
      if (now - lastWheelTime > 300) {
        accumulatedDelta = 0;
      }
      lastWheelTime = now;
      
      // If content is not scrollable, use wheel directly for navigation
      if (!isScrollable) {
        e.preventDefault();
        accumulatedDelta += e.deltaY;
        
        if (Math.abs(accumulatedDelta) >= deltaThreshold && now - lastPageChangeTime > pageChangeCooldown) {
          if (accumulatedDelta > 0 && page < pages) {
            lastPageChangeTime = now;
            accumulatedDelta = 0;
            goToNextPage();
          } else if (accumulatedDelta < 0 && page > 1) {
            lastPageChangeTime = now;
            accumulatedDelta = 0;
            goToPrevPage();
          }
        }
        return;
      }
      
      // Content is scrollable - handle edge cases
      if (e.deltaY > 0 && isAtBottom && page < pages) {
        e.preventDefault();
        accumulatedDelta += e.deltaY;
        
        if (accumulatedDelta >= deltaThreshold && now - lastPageChangeTime > pageChangeCooldown) {
          lastPageChangeTime = now;
          accumulatedDelta = 0;
          goToNextPage();
          setTimeout(() => { wrapper.scrollTop = 0; }, 50);
        }
      } else if (e.deltaY < 0 && isAtTop && page > 1) {
        e.preventDefault();
        accumulatedDelta += e.deltaY;
        
        if (Math.abs(accumulatedDelta) >= deltaThreshold && now - lastPageChangeTime > pageChangeCooldown) {
          lastPageChangeTime = now;
          accumulatedDelta = 0;
          goToPrevPage();
          setTimeout(() => { wrapper.scrollTop = wrapper.scrollHeight; }, 50);
        }
      } else {
        // Normal scrolling within page
        accumulatedDelta = 0;
      }
    };

    // Keyboard navigation
    const handleKeyDown = (e) => {
      const pages = numPagesRef.current;
      const page = currentPageRef.current;
      
      if (pages === 0) return;
      
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        if (page < pages) goToNextPage();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        if (page > 1) goToPrevPage();
      }
    };

    wrapper.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      wrapper.removeEventListener("wheel", handleWheel);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToNextPage, goToPrevPage]);

  /* ---------- Document Load Handlers ---------- */
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(1);
    setError(null);
  };

  const onDocumentLoadError = (error) => {
    console.error("PDF document load error:", error);
    setError("Failed to render PDF document. The file may be corrupted.");
  };

  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center h-64 text-gray-600">
        <Loader2 className="animate-spin mr-3" size={28} />
        <span className="mt-2">Loading document...</span>
        {loadProgress > 0 && loadProgress < 100 && (
          <div className="w-48 h-2 bg-gray-200 rounded-full mt-3">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        )}
      </div>
    );

  if (error || !pdfUrl)
    return (
      <div className="flex flex-col items-center justify-center py-10 text-red-600">
        <AlertCircle size={48} className="mb-3" />
        <p className="text-xl font-semibold">Failed to load PDF document</p>
        <p className="text-sm text-gray-500 mt-2">{error || "Unknown error occurred"}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );

  return (
    <div
      ref={viewerRef}
      className={`flex flex-col h-full bg-white pdf-viewer-container ${className || ""}`}
    >
      {/* Page Indicator */}
      <div className="flex justify-center items-center p-3 bg-white border-b border-gray-200">
        <button 
          onClick={goToPrevPage} 
          disabled={currentPage <= 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed mr-3"
        >
          ← Prev
        </button>
        <span className="text-sm font-medium text-gray-700">
          Page <strong>{currentPage}</strong> / <strong>{numPages}</strong>
        </span>
        <button 
          onClick={goToNextPage} 
          disabled={currentPage >= numPages}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed ml-3"
        >
          Next →
        </button>
      </div>

      {/* PDF Content - Single page with scroll navigation */}
      <div
        ref={pageWrapperRef}
        className="flex-1 flex flex-col items-center py-4 overflow-y-auto bg-gray-100"
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex justify-center items-center h-32">
              <Loader2 className="animate-spin" size={24} />
            </div>
          }
          error={
            <div className="text-red-500 text-center p-4">
              <AlertCircle size={32} className="mx-auto mb-2" />
              <p>Error loading PDF</p>
            </div>
          }
        >
          <Page
            pageNumber={currentPage}
            width={pageWidth}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-2xl mb-4"
            loading={
              <div className="flex justify-center items-center h-64 w-full">
                <Loader2 className="animate-spin" size={24} />
              </div>
            }
          />
        </Document>
      </div>
    </div>
  );
};

export default PdfViewer;
