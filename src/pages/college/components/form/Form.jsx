import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import { getCollegeLogoUrl, getCollegeImageUrl } from "@/http/colleges";
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
  Save,
  ArrowLeft,
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
      // Set existing logo preview URL if available
      if (initialData.logoName && initialData.collegeId) {
        setLogoPreview(getCollegeLogoUrl(initialData.collegeId));
      }
      // Set existing images preview URLs if available
      if (initialData.collegePictureName?.length > 0 && initialData.collegeId) {
        const imageUrls = initialData.collegePictureName.map(imageName => 
          getCollegeImageUrl(initialData.collegeId, imageName)
        );
        setImagePreviews(imageUrls);
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
    
    console.log("Form submission started");
    console.log("Mode:", mode);
    console.log("FormData:", formData);
    console.log("Logo:", logo);
    console.log("Images:", images);
    
    if (!validateForm()) {
      console.log("Validation failed:", errors);
      return;
    }

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
      console.error("Submission error:", err);
      const backendErrors = err || {};
      setErrors((prev) => ({ ...prev, ...backendErrors }));
    } finally {
      setLoading(false);
    }
  };

  const getError = (field) => errors[field] || "";

  return (
    <div className="space-y-6">
      <PageHeader
        title={mode === "add" ? "Register New College" : "Edit College Details"}
        subtitle={mode === "add" ? "Add a new institution to the system" : "Update existing college information"}
        breadcrumbs={[
          { label: "Colleges", to: "/college/all" },
          { label: mode === "add" ? "Add College" : "Edit College" }
        ]}
        icon={University}
      />

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl shadow-sm flex items-center gap-2">
           <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
           {success}
        </div>
      )}

      {Object.keys(errors).length > 0 && Object.values(errors).some(x => x) && (
         <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm">
           <p className="font-semibold mb-1">Please fix the following errors:</p>
           <ul className="list-disc list-inside text-sm opacity-90">
             {Object.keys(errors).map(key => errors[key] && <li key={key}>{errors[key]}</li>)}
           </ul>
         </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-8">
                <div>
                   <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                     <University className="text-indigo-600" size={20} />
                     Basic Details
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* College Name */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          College Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="collegeName"
                          value={formData.collegeName}
                          onChange={handleChange}
                          placeholder="e.g. Acme Institute of Technology"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400"
                        />
                        {getError("collegeName") && (
                          <span className="text-red-600 text-xs mt-1 block">{getError("collegeName")}</span>
                        )}
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Location <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                            <input
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="City, Address"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>
                        {getError("location") && (
                          <span className="text-red-600 text-xs mt-1 block">{getError("location")}</span>
                        )}
                      </div>

                      {/* Established Year */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Established Year <span className="text-xs font-normal text-gray-500">(Optional)</span>
                        </label>
                        <div className="relative">
                             <Calendar className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                            <input
                            name="establishedYear"
                            value={formData.establishedYear}
                            onChange={handleChange}
                            placeholder="YYYY"
                            maxLength={4}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>

                        {getError("establishedYear") && (
                          <span className="text-red-600 text-xs mt-1 block">{getError("establishedYear")}</span>
                        )}
                      </div>

                      {/* Affiliation */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Affiliation <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="affiliation"
                          value={formData.affiliation}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-white"
                        >
                          <option value="">Select University...</option>
                          <option value="NEB">NEB (National Examination Board)</option>
                          <option value="TRIBHUVAN_UNIVERSITY">Tribhuvan University</option>
                          <option value="KATHMANDU_UNIVERSITY">Kathmandu University</option>
                          <option value="POKHARA_UNIVERSITY">Pokhara University</option>
                          <option value="LUMBINI_UNIVERSITY">Lumbini University</option>
                          <option value="PURWANCHAL_UNIVERSITY">Purwanchal University</option>
                          <option value="MID_WESTERN_UNIVERSITY">Mid Western University</option>
                          <option value="FAR_WESTERN_UNIVERSITY">Far Western University</option>
                          <option value="CAMPUS_AFFILIATED_TO_FOREIGN_UNIVERSITY">Foreign Affiliate</option>
                        </select>
                        {getError("affiliation") && (
                          <span className="text-red-600 text-xs mt-1 block">{getError("affiliation")}</span>
                        )}
                      </div>

                      {/* College Type */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          College Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="collegeType"
                          value={formData.collegeType}
                          onChange={handleChange}
                         className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-white"
                        >
                          <option value="PRIVATE">Private</option>
                          <option value="COMMUNITY">Community</option>
                          <option value="GOVERNMENT">Government</option>
                        </select>
                      </div>

                      {/* Priority */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Priority Level <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="priority"
                          value={formData.priority}
                          onChange={handleChange}
                         className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-white"
                        >
                          <option value="HIGH">High Priority</option>
                          <option value="MEDIUM">Medium Priority</option>
                          <option value="LOW">Low Priority</option>
                        </select>
                      </div>
                   </div>
                </div>

                <div>
                   <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                     <Mail className="text-indigo-600" size={20} />
                     Contact & Web
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {/* Email */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="info@college.edu.np"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400"
                        />
                        {getError("email") && (
                          <span className="text-red-600 text-xs mt-1 block">{getError("email")}</span>
                        )}
                      </div>

                       {/* Contact Phone */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="contact"
                          value={formData.contact}
                          onChange={handleChange}
                          placeholder="Phone number"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400"
                        />
                        {getError("contact") && (
                          <span className="text-red-600 text-xs mt-1 block">{getError("contact")}</span>
                        )}
                      </div>

                       {/* Website */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Website URL <span className="text-xs font-normal text-gray-500">(Optional)</span>
                        </label>
                        <div className="relative">
                             <Globe className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                            <input
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="https://www.college.edu.np"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400"
                            />
                        </div>
                        {getError("website") && (
                          <span className="text-red-600 text-xs mt-1 block">{getError("website")}</span>
                        )}
                      </div>
                   </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                        <ListChecks className="text-indigo-600" size={20} />
                        About College
                    </h3>
                    <div className="relative">
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={6}
                            placeholder="Write a detailed description about the college..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-gray-400 leading-relaxed resize-y"
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/50 px-2 rounded backdrop-blur-sm">
                            {formData.description.length} chars
                        </div>
                    </div>
                    {getError("description") && (
                        <span className="text-red-600 text-xs mt-1 block">{getError("description")}</span>
                    )}
                </div>
            </div>
        </div>

        {/* Right Column: Media Uploads & Actions */}
        <div className="space-y-6">
             {/* Main Logo Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 className="text-indigo-600" size={20} />
                    College Logo
                </h3>
                <div className="space-y-4">
                     <div className="flex justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                        {logoPreview ? (
                            <div className="relative w-40 h-40">
                                <img
                                src={typeof logoPreview === "string" && logoPreview.startsWith("blob:") 
                                    ? logoPreview 
                                    : logoPreview}
                                alt="Logo preview"
                                className="w-full h-full object-contain bg-white rounded-lg shadow-sm p-2"
                                />
                                <button
                                type="button"
                                onClick={removeLogo}
                                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-md transition-all active:scale-95"
                                >
                                <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center cursor-pointer w-full h-40">
                                <div className="p-4 bg-white rounded-full shadow-sm mb-3">
                                   <Upload className="w-8 h-8 text-indigo-500" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Click to upload</span>
                                <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                                <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="hidden"
                                />
                            </label>
                        )}
                     </div>
                     {getError("logo") && (
                        <span className="text-red-600 text-xs text-center block">{getError("logo")}</span>
                     )}
                </div>
            </div>

             {/* Gallery Images */}
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Image className="text-indigo-600" size={20} />
                    Gallery Images
                </h3>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
                        <img
                        src={typeof preview === "string" && preview.startsWith("blob:") 
                            ? preview 
                            : preview}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border border-gray-100"
                        />
                        <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
                        >
                        <X size={12} />
                        </button>
                    </div>
                    ))}
                    
                    {images.length < 10 && (
                        <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                            <Upload className="w-6 h-6 text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500 font-medium">Add Photo</span>
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
                
                 <div className="text-xs text-center text-gray-500">
                    <p>{imagePreviews.length} / 10 images uploaded</p>
                    {mode === "add" && <p className="text-indigo-600 font-medium mt-1">At least 1 image recommended</p>}
                </div>
                 {getError("images") && (
                    <span className="text-red-600 text-xs text-center block mt-2">{getError("images")}</span>
                 )}
            </div>

             {/* Actions */}
             <div className="flex flex-col gap-3">
                 <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                 >
                    {loading ? (
                        <>
                           <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                           Processing...
                        </>
                    ) : (
                        <>
                           <Save size={18} />
                           {mode === "add" ? "Save College" : "Update Changes"}
                        </>
                    )}
                 </button>
                 <button
                    type="button"
                    onClick={() => navigate("/college/all")}
                    className="w-full px-6 py-3.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                 >
                    <ArrowLeft size={18} />
                    Cancel
                 </button>
             </div>
        </div>
      </form>
    </div>
  );
};

export default CollegeForm;
