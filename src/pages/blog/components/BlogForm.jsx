import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Image, FileText, Mail, Phone, Hash, Tag } from "lucide-react";

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
        setImagePreview(`https://api.entrancegateway.com/images/${initialData.imageName}`);
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
      `mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200
      ${errors[field] ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"}`,
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
    
    if (form.image) {
      formData.append("image", form.image);
    }

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

      // Redirect to blogs list after success
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {mode === "add" ? "Create New Blog" : "Edit Blog"}
        </h1>
        <p className="text-gray-600">
          {mode === "add" ? "Write and publish your blog post" : "Update your blog post"}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="p-8 space-y-6">
          {/* Global Error */}
          {errors.global && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              {errors.global}
            </div>
          )}

          {/* Success Message */}
          {status.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              ✓ {status.success}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
              <FileText size={18} className="text-indigo-600" />
              Blog Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={inputClass("title")}
              placeholder="Enter blog title..."
              maxLength={255}
            />
            <div className="flex justify-between mt-1">
              {errors.title && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.title}
                </p>
              )}
              <span className="text-xs text-gray-400 ml-auto">{form.title.length}/255</span>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
              <FileText size={18} className="text-indigo-600" />
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={8}
              className={inputClass("content")}
              placeholder="Write your blog content here..."
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.content}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
              <Image size={18} className="text-indigo-600" />
              Featured Image
            </label>
            <div className="mt-1 flex items-center gap-4">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
            </div>
            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-40 w-auto object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>

          {/* Contact Info Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                  <Mail size={18} className="text-indigo-600" />
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={form.contactEmail}
                  onChange={handleChange}
                  className={inputClass("contactEmail")}
                  placeholder="email@example.com"
                />
                {errors.contactEmail && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.contactEmail}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                  <Phone size={18} className="text-indigo-600" />
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                  className={inputClass("contactPhone")}
                  placeholder="+977-9800000000"
                />
              </div>
            </div>
          </div>

          {/* SEO Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">SEO Settings</h3>
            
            {/* Meta Title */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                <Tag size={18} className="text-indigo-600" />
                Meta Title
              </label>
              <input
                type="text"
                name="metaTitle"
                value={form.metaTitle}
                onChange={handleChange}
                className={inputClass("metaTitle")}
                placeholder="SEO-friendly title (max 60 chars)"
                maxLength={60}
              />
              <div className="flex justify-between mt-1">
                {errors.metaTitle && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.metaTitle}
                  </p>
                )}
                <span className="text-xs text-gray-400 ml-auto">{form.metaTitle.length}/60</span>
              </div>
            </div>

            {/* Meta Description */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                <FileText size={18} className="text-indigo-600" />
                Meta Description
              </label>
              <textarea
                name="metaDescription"
                value={form.metaDescription}
                onChange={handleChange}
                rows={3}
                className={inputClass("metaDescription")}
                placeholder="Brief description for search engines (max 160 chars)"
                maxLength={160}
              />
              <div className="flex justify-between mt-1">
                {errors.metaDescription && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.metaDescription}
                  </p>
                )}
                <span className="text-xs text-gray-400 ml-auto">{form.metaDescription.length}/160</span>
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1">
                <Hash size={18} className="text-indigo-600" />
                Keywords
              </label>
              <input
                type="text"
                name="keywords"
                value={form.keywords}
                onChange={handleChange}
                className={inputClass("keywords")}
                placeholder="keyword1, keyword2, keyword3"
                maxLength={255}
              />
              <div className="flex justify-between mt-1">
                {errors.keywords && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.keywords}
                  </p>
                )}
                <span className="text-xs text-gray-400 ml-auto">{form.keywords.length}/255</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-8 py-4 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/blogs")}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={status.loading}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
          >
            {status.loading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                {mode === "add" ? "Creating..." : "Updating..."}
              </>
            ) : (
              mode === "add" ? "Create Blog" : "Update Blog"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
