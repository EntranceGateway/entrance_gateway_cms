import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import { AlertCircle, Image, FileText, Mail, Phone, Hash, Tag, Save, BookOpen } from "lucide-react";
import { getBlogFileUrl } from "../../../http/blog";

// -----------------------------
// Default Form Shape
// -----------------------------
const DEFAULT_FORM = Object.freeze({
  title: "",
  content: "",
  image: null,
  contactEmail: "",
  contactPhone: "",
  metaTitle: "",
  metaDescription: "",
  keywords: "",
});

// -----------------------------
// Validation Logic
// -----------------------------
const validateForm = (form) => {
  const errors = {};
  if (!form.title.trim()) errors.title = "Blog title is required";
  if (form.title.length > 255) errors.title = "Title must be less than 255 characters";
  if (!form.content.trim()) errors.content = "Blog content is required";
  if (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
    errors.contactEmail = "Invalid email format";
  }
  if (form.metaTitle && form.metaTitle.length > 60) {
    errors.metaTitle = "Meta title must be less than 60 characters";
  }
  if (form.metaDescription && form.metaDescription.length > 160) {
    errors.metaDescription = "Meta description must be less than 160 characters";
  }
  if (form.keywords && form.keywords.length > 255) {
    errors.keywords = "Keywords must be less than 255 characters";
  }
  return errors;
};

// ==========================================================
//  COMPONENT
// ==========================================================
const BlogForm = ({ mode = "add", initialData = null, onSubmit }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, success: "" });
  const [imagePreview, setImagePreview] = useState(null);

  // -----------------------------
  // Load initial data in edit mode
  // -----------------------------
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        title: initialData.title || "",
        content: initialData.content || "",
        image: null,
        contactEmail: initialData.contactEmail || "",
        contactPhone: initialData.contactPhone || "",
        metaTitle: initialData.metaTitle || "",
        metaDescription: initialData.metaDescription || "",
        keywords: initialData.keywords || "",
      });
      if (initialData.imageName) {
        setImagePreview(getBlogFileUrl(initialData.blogId));
      }
    } else {
      setForm(DEFAULT_FORM);
      setImagePreview(null);
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
      
      // Create preview for image
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
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
    formData.append("content", form.content.trim());
    if (form.contactEmail) formData.append("contactEmail", form.contactEmail.trim());
    if (form.contactPhone) formData.append("contactPhone", form.contactPhone.trim());
    if (form.metaTitle) formData.append("metaTitle", form.metaTitle.trim());
    if (form.metaDescription) formData.append("metaDescription", form.metaDescription.trim());
    if (form.keywords) formData.append("keywords", form.keywords.trim());
    if (form.image) formData.append("image", form.image);
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
        success: mode === "add" ? "Blog created successfully!" : "Blog updated successfully!",
      });
      setTimeout(() => {
        navigate("/blogs");
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
        title={mode === "add" ? "Create New Blog Post" : "Edit Blog Post"}
        subtitle={mode === "add" ? "Share news and updates" : "Update blog content"}
        breadcrumbs={[
            { label: "Blogs", to: "/blogs" },
            { label: mode === "add" ? "Create" : "Edit" }
        ]}
        icon={BookOpen}
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

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Main Content Section */}
          <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Blog Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className={inputClass("title")}
                  placeholder="Enter catchy title..."
                  maxLength={255}
                />
                 {errors.title && <p className="text-xs text-red-600 mt-1 flex items-center gap-1">{errors.title}</p>}
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                   Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={10}
                  className={inputClass("content")}
                  placeholder="Write your blog post content..."
                />
                 {errors.content && <p className="text-xs text-red-600 mt-1 flex items-center gap-1">{errors.content}</p>}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Featured Image</label>
                <div className={`relative flex items-center justify-center w-full rounded-xl border-2 border-dashed transition-all p-6 ${errors.image ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
                    <label className="flex flex-col items-center justify-center w-full cursor-pointer">
                        {imagePreview ? (
                            <div className="relative group">
                                <img src={imagePreview} alt="Preview" className="h-48 object-cover rounded-lg shadow-sm border border-gray-200" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                    <span className="text-white text-sm font-medium">Click to change</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-gray-500">
                                <Image size={32} className="mb-2 text-gray-400" />
                                <span className="text-sm font-medium">Click to upload image</span>
                                <span className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WEBP</span>
                            </div>
                        )}
                        <input type="file" name="image" onChange={handleChange} accept="image/*" className="hidden" />
                    </label>
                </div>
              </div>
          </div>

          {/* Contact Info Section */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Mail size={18} className="text-indigo-600"/> Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={form.contactEmail}
                  onChange={handleChange}
                  className={inputClass("contactEmail")}
                  placeholder="contact@example.com"
                />
                 {errors.contactEmail && <p className="text-xs text-red-600 mt-1 flex items-center gap-1">{errors.contactEmail}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contact Phone</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                  className={inputClass("contactPhone")}
                  placeholder="+977-..."
                />
              </div>
            </div>
          </div>

          {/* SEO Section */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Hash size={18} className="text-indigo-600"/> SEO Settings
            </h3>
            <div className="space-y-4">
                <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1.5">Meta Title</label>
                   <input
                    type="text"
                    name="metaTitle"
                    value={form.metaTitle}
                    onChange={handleChange}
                    className={inputClass("metaTitle")}
                    maxLength={60}
                    placeholder="SEO Title"
                   />
                   <div className="flex justify-end mt-1"><span className="text-xs text-gray-400">{form.metaTitle.length}/60</span></div>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1.5">Meta Description</label>
                   <textarea
                    name="metaDescription"
                    value={form.metaDescription}
                    onChange={handleChange}
                    rows={3}
                    className={inputClass("metaDescription")}
                    maxLength={160}
                    placeholder="Short description for search results"
                   />
                   <div className="flex justify-end mt-1"><span className="text-xs text-gray-400">{form.metaDescription.length}/160</span></div>
                </div>

                <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-1.5">Keywords</label>
                   <input
                    type="text"
                    name="keywords"
                    value={form.keywords}
                    onChange={handleChange}
                    className={inputClass("keywords")}
                    placeholder="comma, separated, keywords"
                   />
                </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={() => navigate("/blogs")}
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
              {status.loading ? "Saving..." : mode === "add" ? "Create Blog" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};

export default BlogForm;
