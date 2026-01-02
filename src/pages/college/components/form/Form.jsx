import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  University,
  Mail,
  Phone,
  Globe,
  Calendar,
  MapPin,
  ListChecks,
  Image,
  Upload,
  X,
} from "lucide-react";

const defaultForm = {
  collegeName: "",
  location: "",
  affiliation: "",
  priority: "HIGH",
  website: "",
  contact: "",
  email: "",
  description: "",
  establishedYear: "",
  collegeType: "PRIVATE",
};

const CollegeForm = ({ mode = "add", initialData = null, onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  
  // File states
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...defaultForm, ...initialData });
      // Set existing logo preview if available
      if (initialData.logoName) {
        setLogoPreview(initialData.logoName);
      }
      // Set existing images previews if available
      if (initialData.collegePictureName?.length > 0) {
        setImagePreviews(initialData.collegePictureName);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, logo: "Logo must be less than 5MB" }));
        return;
      }
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, logo: "" }));
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      setErrors((prev) => ({ ...prev, images: "Maximum 10 images allowed" }));
      return;
    }
    
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, images: "Each image must be less than 5MB" }));
        return false;
      }
      return true;
    });
    
    setImages((prev) => [...prev, ...validFiles]);
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const removeLogo = () => {
    setLogo(null);
    setLogoPreview(null);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.collegeName.trim())
      newErrors.collegeName = "College name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.contact.trim()) newErrors.contact = "Contact is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.affiliation.trim())
      newErrors.affiliation = "Affiliation is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    // Logo required for add mode
    if (mode === "add" && !logo) {
      newErrors.logo = "Logo is required";
    }

    // At least one image required for add mode
    if (mode === "add" && images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    // Contact: must be 10 digits
    if (formData.contact && !/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = "Contact must be exactly 10 digits";
    }

    // Email format
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Description length
    if (
      formData.description &&
      (formData.description.length < 50 || formData.description.length > 2000)
    ) {
      newErrors.description =
        "Description must be between 50 and 2000 characters";
    }

    // Website format (optional)
    if (
      formData.website &&
      !/^(https?:\/\/)?([\w\d-]+\.)+[\w]{2,}(\/.*)?$/.test(formData.website)
    ) {
      newErrors.website = "Invalid website URL";
    }

    // Established Year: optional but must be 4 digits if entered
    if (formData.establishedYear && !/^\d{4}$/.test(formData.establishedYear)) {
      newErrors.establishedYear = "Established year must be 4 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setErrors({});
    if (!validateForm()) return;

    try {
      setLoading(true);
      await onSubmit(formData, logo, images);
      setSuccess(
        mode === "add"
          ? "College added successfully!"
          : "College updated successfully!"
      );
      
      // Redirect to colleges list after success
      setTimeout(() => {
        navigate("/college/all");
      }, 1500);
    } catch (err) {
      const backendErrors = err || {};
      setErrors((prev) => ({ ...prev, ...backendErrors }));
    } finally {
      setLoading(false);
    }
  };

  const getError = (field) => errors[field] || "";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3 mb-4">
          <University className="text-blue-600" />{" "}
          {mode === "add" ? "Add College" : "Edit College"}
        </h1>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg text-center font-medium mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* College Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                <Building2 className="inline w-4 h-4 mr-1" /> College Name *
              </label>
              <input
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {getError("collegeName") && (
                <span className="text-red-600 text-sm">
                  {getError("collegeName")}
                </span>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">
                <Mail className="inline w-4 h-4 mr-1" /> Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {getError("email") && (
                <span className="text-red-600 text-sm">
                  {getError("email")}
                </span>
              )}
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium mb-1">
                <Phone className="inline w-4 h-4 mr-1" /> Contact *
              </label>
              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {getError("contact") && (
                <span className="text-red-600 text-sm">
                  {getError("contact")}
                </span>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-1">
                <MapPin className="inline w-4 h-4 mr-1" /> Location *
              </label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {getError("location") && (
                <span className="text-red-600 text-sm">
                  {getError("location")}
                </span>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium mb-1">
                <ListChecks className="inline w-4 h-4 mr-1" /> Priority *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>

            {/* Affiliation */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Affiliation *
              </label>
              <select
                name="affiliation"
                value={formData.affiliation}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">-- Select University --</option>
                <option value="TRIBHUVAN_UNIVERSITY">
                  Tribhuvan University
                </option>
                <option value="KATHMANDU_UNIVERSITY">
                  Kathmandu University
                </option>
                <option value="POKHARA_UNIVERSITY">Pokhara University</option>
                <option value="LUMBINI_UNIVERSITY">Lumbini University</option>
                <option value="PURWANCHAL_UNIVERSITY">
                  Purwanchal University
                </option>
                <option value="MID_WESTERN_UNIVERSITY">
                  Mid Western University
                </option>
                <option value="FAR_WESTERN_UNIVERSITY">
                  Far Western University
                </option>
                <option value="CAMPUS_AFFILIATED_TO_FOREIGN_UNIVERSITY">
                  Campus Affiliated to Foreign University
                </option>
              </select>
              {getError("affiliation") && (
                <span className="text-red-600 text-sm">
                  {getError("affiliation")}
                </span>
              )}
            </div>

            {/* Established Year */}
            <div>
              <label className="block text-sm font-medium mb-1">
                <Calendar className="inline w-4 h-4 mr-1" /> Established Year
              </label>
              <input
                name="establishedYear"
                value={formData.establishedYear}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {getError("establishedYear") && (
                <span className="text-red-600 text-sm">
                  {getError("establishedYear")}
                </span>
              )}
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium mb-1">
                <Globe className="inline w-4 h-4 mr-1" /> Website
              </label>
              <input
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {getError("website") && (
                <span className="text-red-600 text-sm">
                  {getError("website")}
                </span>
              )}
            </div>

            {/* College Type */}
            <div>
              <label className="block text-sm font-medium mb-1">
                College Type *
              </label>
              <select
                name="collegeType"
                value={formData.collegeType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="PRIVATE">Private</option>
                <option value="COMMUNITY">Community</option>
                <option value="GOVERNMENT">Government</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg"
              />
              {getError("description") && (
                <span className="text-red-600 text-sm">
                  {getError("description")}
                </span>
              )}
            </div>

            {/* Logo Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                <Image className="inline w-4 h-4 mr-1" /> College Logo {mode === "add" && "*"}
              </label>
              <div className="flex items-start gap-4">
                {logoPreview ? (
                  <div className="relative">
                    <img
                      src={typeof logoPreview === "string" && logoPreview.startsWith("blob:") 
                        ? logoPreview 
                        : logoPreview}
                      alt="Logo preview"
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                )}
                <div className="text-sm text-gray-500">
                  <p>Upload college logo</p>
                  <p className="text-xs">Max size: 5MB</p>
                </div>
              </div>
              {getError("logo") && (
                <span className="text-red-600 text-sm">{getError("logo")}</span>
              )}
            </div>

            {/* College Images Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                <Image className="inline w-4 h-4 mr-1" /> College Images {mode === "add" && "*"}
              </label>
              <div className="flex flex-wrap gap-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={typeof preview === "string" && preview.startsWith("blob:") 
                        ? preview 
                        : preview}
                      alt={`Image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {images.length < 10 && (
                  <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload className="w-5 h-5 text-gray-400" />
                    <span className="text-xs text-gray-500">Add</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Upload up to 10 images (max 5MB each)
              </p>
              {getError("images") && (
                <span className="text-red-600 text-sm">{getError("images")}</span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex gap-3 justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 bg-blue-600 text-white rounded-lg ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {loading
                ? "Saving..."
                : mode === "add"
                ? "Add College"
                : "Update College"}
            </button>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollegeForm;
