import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import { AlertCircle, Image, FileText, File, Save, Bell } from "lucide-react";

// -----------------------------
// Default Form Shape
// -----------------------------
const DEFAULT_FORM = Object.freeze({
  title: "",
  description: "",
  file: null,
});

// Helper to check if file is PDF
const isPdfFile = (filename) => {
  if (!filename) return false;
  return filename.toLowerCase().endsWith(".pdf");
};

// -----------------------------
// Validation Logic
// -----------------------------
const validateForm = (form) => {
  const errors = {};
  if (!form.title.trim()) errors.title = "Notice title is required";
  if (form.title.length > 255) errors.title = "Title must be less than 255 characters";
  return errors;
};

// ==========================================================
//  COMPONENT
// ==========================================================
const NoticeForm = ({ mode = "add", initialData = null, onSubmit }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, success: "" });
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState(null); // 'image' or 'pdf'

  // -----------------------------
  // Load initial data in edit mode
  // -----------------------------
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        file: null,
      });
      if (initialData.imageName) {
        const fileUrl = `https://api.entrancegateway.com/api/v1/notices/getNoticeFile/${initialData.noticeId}`;
        setFilePreview(fileUrl);
        setFileType(isPdfFile(initialData.imageName) ? "pdf" : "image");
      }
    } else {
      setForm(DEFAULT_FORM);
      setFilePreview(null);
      setFileType(null);
    }
    setErrors({});
    setStatus({ loading: false, success: "" });
  }, [mode, initialData]);

  // -----------------------------
  // Memoized Input Class Generator
  // -----------------------------
  const inputClass = useCallback(
    (field) =>
      `block w-full rounded-xl border px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
        errors[field] ? "border-red-300 ring-red-200" : "border-gray-200 bg-gray-50/50 focus:bg-white"
      }`,
    [errors]
  );

  // -----------------------------
  // Input Handler
  // -----------------------------
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      const file = files[0] || null;
      setForm((prev) => ({ ...prev, [name]: file }));
      
      // Create preview based on file type
      if (file) {
        if (file.type === "application/pdf") {
          setFileType("pdf");
          setFilePreview(file.name);
        } else if (file.type.startsWith("image/")) {
          setFileType("image");
          const reader = new FileReader();
          reader.onloadend = () => setFilePreview(reader.result);
          reader.readAsDataURL(file);
        } else {
          setFileType("other");
          setFilePreview(file.name);
        }
      } else {
        setFilePreview(null);
        setFileType(null);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // -----------------------------
  // Build FormData Payload
  // -----------------------------
  const buildPayload = useCallback(() => {
    const formData = new FormData();
    formData.append("title", form.title.trim());
    if (form.description) formData.append("description", form.description.trim());
    if (form.file) formData.append("image", form.file);
    return formData;
  }, [form]);

  // -----------------------------
  // Submit Handler
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus({ loading: true, success: "" });

    try {
      const payload = buildPayload();
      await onSubmit(payload);
      setStatus({
        loading: false,
        success: mode === "add" ? "Notice created successfully!" : "Notice updated successfully!",
      });
      setTimeout(() => {
        navigate("/notices/all");
      }, 1500);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        global: err?.error || err?.message || "Something went wrong. Please try again.",
      }));
      setStatus({ loading: false, success: "" });
    }
  };

  return (
    <div className="w-full">
      <PageHeader
        title={mode === "add" ? "Create New Notice" : "Edit Notice"}
        subtitle={mode === "add" ? "Announce important updates to students" : "Update notice details"}
        breadcrumbs={[
            { label: "Notices", to: "/notices/all" },
            { label: mode === "add" ? "Create" : "Edit" }
        ]}
        icon={Bell}
      />

      <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden p-8">
        
        {/* Messages */}
        {errors.global && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-800 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {errors.global}
          </div>
        )}
        {status.success && (
          <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-800 text-sm flex items-center gap-2">
            <Save size={16} />
            {status.success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Notice Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={inputClass("title")}
              placeholder="e.g., Exam Schedule 2024"
              maxLength={255}
            />
             {errors.title && <p className="text-xs text-red-600 mt-1 flex items-center gap-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className={inputClass("description")}
              placeholder="Detailed information about the notice..."
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Attachment (Image or PDF)</label>
            <div className={`relative flex items-center justify-center w-full rounded-xl border-2 border-dashed transition-all p-6 ${errors.file ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
               <label className="flex flex-col items-center justify-center w-full cursor-pointer">
                  {filePreview ? (
                     <div className="flex flex-col items-center">
                        {fileType === "image" ? (
                           <img src={filePreview} alt="Preview" className="h-40 object-contain rounded-lg shadow-sm border border-gray-200" />
                        ) : (
                           <div className="flex items-center gap-2 text-red-600 bg-white px-4 py-2 rounded-lg border border-red-100 shadow-sm">
                              <FileText size={24} />
                              <span className="font-medium">
                                 {typeof filePreview === "string" && filePreview.startsWith("http") ? initialData?.imageName : filePreview}
                              </span>
                           </div>
                        )}
                        <span className="mt-2 text-xs text-indigo-600 font-medium">Click to change file</span>
                     </div>
                  ) : (
                     <div className="flex flex-col items-center text-gray-500">
                        <File size={32} className="mb-2 text-gray-400" />
                        <span className="text-sm font-medium">Click to upload text/image/PDF</span>
                        <span className="text-xs text-gray-400 mt-1">Supports JPG, PNG, PDF</span>
                     </div>
                  )}
                  <input type="file" name="file" onChange={handleChange} accept="image/*,.pdf,application/pdf" className="hidden" />
               </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={() => navigate("/notices/all")}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status.loading}
              className="flex-1 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {status.loading ? "Saving..." : mode === "add" ? "Create Notice" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};

export default NoticeForm;
