import React, { useState, useEffect, useRef } from "react";
import { Loader2, Download, AlertCircle, FileText, ExternalLink } from "lucide-react";
import PdfViewer from "../pdfview/PdfViewer";
import api from "../../http/index";

// Helper to fetch file as Blob (for Auth Header support)
const fetchFileBlob = async (url, token) => {
  const response = await api.get(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    responseType: "blob",
  });
  return response.data;
};

const FileViewer = ({
  fileUrl,
  token,
  className = "",
  fileName = "file",
  forceDownload = false,
}) => {
  const [fileType, setFileType] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  // 1. Detect Content-Type & Load File
  useEffect(() => {
    isMounted.current = true;
    let objectUrl = null;

    const loadFile = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!fileUrl) {
          throw new Error("No file URL provided");
        }

        // A. Detection Phase: HEAD request
        // We try to get headers first.
        // NOTE: Some CORS setups might block HEAD requests. If so, we might failover to GET.
        let contentType = null;
        try {
          const headRes = await api.head(fileUrl, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          contentType = headRes.headers["content-type"];
        } catch (headErr) {
          console.warn("HEAD request failed, falling back to GET detection", headErr);
        }

        // B. Fetching Phase
        // Since we need Auth Headers, we MUST fetch as Blob for <img> and <video> to work securely
        // without cookies. If we had cookies, we could just utilize `fileUrl` directly.
        const blob = await fetchFileBlob(fileUrl, token);
        
        // If HEAD failed, use Blob type
        if (!contentType) {
          contentType = blob.type;
        }

        if (isMounted.current) {
          setFileType(contentType);
          objectUrl = URL.createObjectURL(blob);
          setBlobUrl(objectUrl);
        }
      } catch (err) {
        console.error("File load error:", err);
        if (isMounted.current) {
          setError(err.message || "Failed to load file");
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    loadFile();

    return () => {
      isMounted.current = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [fileUrl, token]);

  // Handler for manual download
  const handleDownload = () => {
    if (blobUrl) {
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenNewTab = () => {
    if (blobUrl) {
      window.open(blobUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg ${className}`}>
        <Loader2 className="animate-spin text-indigo-600 mb-2" size={32} />
        <p className="text-gray-500">Loading file...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 bg-red-50 text-red-600 rounded-lg border border-red-200 ${className}`}>
        <AlertCircle size={32} className="mb-2" />
        <p className="font-medium">Failed to load file</p>
        <p className="text-sm opacity-80 mt-1">{error}</p>
        <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-white border border-red-200 rounded text-sm hover:bg-gray-50"
        >
            Retry
        </button>
      </div>
    );
  }

  // --- RENDERERS ---

  // 1. PDF Renderer
  if (fileType?.includes("pdf")) {
    return (
      <div className={`w-full ${className}`}>
         {/* Using existing PdfViewer for consistency */}
         <PdfViewer
            token={token}
            fetchPdfBlob={async (url) => {
              const res = await fetch(url);
              return res.blob();
            }}
            pdfFileUrl={blobUrl} // Pass pre-fetched blob URL
            className="w-full h-full min-h-[600px]"
          />
      </div>
    );
  }

  // 2. Image Renderer
  if (fileType?.includes("image/")) {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <img 
            src={blobUrl} 
            alt={fileName} 
            className="max-w-full h-auto rounded shadow-sm object-contain max-h-[80vh]" 
        />
        <div className="flex gap-2 mt-4">
             <button
                onClick={handleOpenNewTab}
                className="flex items-center gap-2 px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                >
                <ExternalLink size={18} />
                Open Full
            </button>
            <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                <Download size={18} />
                Download
            </button>
        </div>
      </div>
    );
  }

  // 3. Video Renderer
  if (fileType?.includes("video/")) {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <video controls className="w-full max-h-[80vh] rounded shadow-lg bg-black">
          <source src={blobUrl} type={fileType} />
          Your browser does not support the video tag.
        </video>
         <div className="flex gap-2 mt-4">
            <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                <Download size={18} />
                Download Video
            </button>
        </div>
      </div>
    );
  }

  // 4. Default / Fallback (Download Only)
  return (
    <div className={`flex flex-col items-center justify-center p-10 bg-gray-50 border border-gray-200 rounded-lg ${className}`}>
      <div className="bg-white p-4 rounded-full shadow-sm mb-4">
        <FileText size={48} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Preview Not Available</h3>
      <p className="text-gray-500 mb-6 text-center max-w-sm">
        This file type ({fileType || "unknown"}) cannot be previewed directly in the browser.
      </p>
      
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all shadow-sm transform active:scale-95"
      >
        <Download size={20} />
        Download {fileName}
      </button>
    </div>
  );
};

export default FileViewer;
