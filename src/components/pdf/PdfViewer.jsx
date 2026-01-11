import React, { useEffect, useState, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { 
  Loader2, 
  AlertCircle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText
} from "lucide-react";
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
  pdfFileUrl,  // New: Complete URL (preferred)
  suburl,      // Legacy: Base URL that gets noteId appended
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
  const [goToPageInput, setGoToPageInput] = useState("");

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
          // Use pdfFileUrl if provided, otherwise fall back to legacy suburl format
          const fetchUrl = pdfFileUrl || `${suburl}/${noteId}`;
          blob = await fetchPdfBlob(fetchUrl, token);

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
  }, [noteId, token, fetchPdfBlob, pdfFileUrl, suburl, enableOfflineCache]);

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

  // Go to specific page
  const goToPage = useCallback((pageNum) => {
    const page = parseInt(pageNum, 10);
    if (!isNaN(page) && page >= 1 && page <= numPagesRef.current) {
      setCurrentPage(page);
      currentPageRef.current = page;
      setGoToPageInput("");
      // Scroll to top when jumping to a page
      if (pageWrapperRef.current) {
        pageWrapperRef.current.scrollTop = 0;
      }
    }
  }, []);

  // Handle go to page input submission
  const handleGoToPageSubmit = useCallback((e) => {
    e.preventDefault();
    goToPage(goToPageInput);
  }, [goToPageInput, goToPage]);

  // Handle input change for go to page
  const handleGoToPageInputChange = useCallback((e) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setGoToPageInput(value);
    }
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

  /* ---------- Zoom & Fullscreen ---------- */
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `document_${noteId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [pdfUrl, noteId]);

  /* ---------- Render Helpers ---------- */
  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center h-full min-h-[400px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-100 rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText className="text-indigo-600" size={24} />
          </div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading document...</p>
        
        {loadProgress > 0 && loadProgress < 100 && (
          <div className="w-48 h-1.5 bg-gray-200 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        )}
      </div>
    );

  if (error || !pdfUrl)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-600">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <AlertCircle size={40} />
        </div>
        <p className="text-xl font-bold text-gray-900">Failed to load PDF</p>
        <p className="text-sm text-gray-500 mt-2 mb-6">{error || "Unknown error occurred"}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Try Again
        </button>
      </div>
    );

  return (
    <div
      ref={viewerRef}
      className={`flex flex-col h-full bg-white pdf-viewer-container relative ${className || ""}`}
    >
      {/* Enhanced Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border-b border-gray-200 shadow-sm z-10">
        
        {/* Left: Page Navigation */}
        <div className="flex items-center gap-2">
          <button 
            onClick={goToPrevPage} 
            disabled={currentPage <= 1}
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-all"
            title="Previous Page"
          >
            <ChevronLeft size={20} />
          </button>
          
          <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium text-gray-700 tabular-nums">
            {currentPage} / {numPages}
          </span>
          
          <button 
            onClick={goToNextPage} 
            disabled={currentPage >= numPages}
            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-all"
            title="Next Page"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Center: Go to Page */}
        <form onSubmit={handleGoToPageSubmit} className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400 uppercase">Go to</span>
          <div className="relative">
            <input
              type="text"
              value={goToPageInput}
              onChange={handleGoToPageInputChange}
              placeholder="#"
              className="w-12 px-2 py-1 text-center text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </form>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 border-l border-gray-200 pl-3">
          <button 
            onClick={handleZoomOut}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>
          
          <span className="text-xs font-medium text-gray-400 w-12 text-center">
            {Math.round(scale * 100)}%
          </span>

          <button 
            onClick={handleZoomIn}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>

          <div className="w-px h-6 bg-gray-200 mx-1"></div>

          <button 
            onClick={handleDownload}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Download PDF"
          >
            <Download size={18} />
          </button>

          <button 
            onClick={toggleFullscreen}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      <div
        ref={pageWrapperRef}
        className="flex-1 flex flex-col items-center py-6 overflow-y-auto bg-gray-100/50"
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex justify-center items-center h-32">
              <Loader2 className="animate-spin text-indigo-500" size={32} />
            </div>
          }
          error={
            <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
              <AlertCircle size={24} className="mx-auto mb-2" />
              <p>Error loading PDF pages</p>
            </div>
          }
        >
          <Page
            pageNumber={currentPage}
            width={pageWidth}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="shadow-2xl mb-4 transition-transform duration-200"
            loading={
              <div className="flex justify-center items-center h-96 w-full bg-white rounded-lg shadow-sm">
                <Loader2 className="animate-spin text-indigo-400" size={40} />
              </div>
            }
          />
        </Document>
      </div>
    </div>
  );
};

export default PdfViewer;
