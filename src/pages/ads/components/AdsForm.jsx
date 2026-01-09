import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createAd, updateAd } from "../../../http/ads";
import {
  AD_POSITIONS,
  AD_STATUSES,
  AD_PRIORITIES,
} from "@/constants/ads.constants";
import {
  AlertCircle,
  Image,
  FileText,
  Calendar,
  DollarSign,
  Target,
  Tag,
  MapPin,
  Monitor,
  X,
} from "lucide-react";

const DEFAULT_FORM = {
  title: "",
  banner: "",
  position: "",
  priority: "LOW",
  status: "DRAFT",
  startDate: "",
  endDate: "",
  maxImpressions: "",
  maxClicks: "",
  costPerClick: "",
  costPerImpression: "",
  totalBudget: "",
  targetAudience: "",
  tags: "",
  isActive: true,
  createdBy: "",
  notes: "",
  targetLocation: "",
  targetDevices: "",
  displaySchedule: "",
  weight: 1,
  trackingPixel: "",
  utmParameters: "",
};

const AdsForm = ({ mode = "create", initialData = null, adId = null }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, success: "", error: "" });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Initialize form with data
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        title: initialData.title || "",
        banner: initialData.banner || "",
        position: initialData.position || "",
        priority: initialData.priority || "LOW",
        status: initialData.status || "DRAFT",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        maxImpressions: initialData.maxImpressions || "",
        maxClicks: initialData.maxClicks || "",
        costPerClick: initialData.costPerClick || "",
        costPerImpression: initialData.costPerImpression || "",
        totalBudget: initialData.totalBudget || "",
        targetAudience: initialData.targetAudience || "",
        tags: initialData.tags || "",
        isActive: initialData.isActive ?? true,
        createdBy: initialData.createdBy || user.email || "",
        notes: initialData.notes || "",
        targetLocation: initialData.targetLocation || "",
        targetDevices: initialData.targetDevices || "",
        displaySchedule: initialData.displaySchedule || "",
        weight: initialData.weight || 1,
        trackingPixel: initialData.trackingPixel || "",
        utmParameters: initialData.utmParameters || "",
      });
      if (initialData.images) {
        setExistingImages(initialData.images);
      }
    } else {
      setForm({
        ...DEFAULT_FORM,
        createdBy: user.email || "",
      });
    }
  }, [mode, initialData, user.email]);

  // Input class generator
  const inputClass = useCallback(
    (field) =>
      `mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200
      ${errors[field] ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"}`,
    [errors]
  );

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Generate previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Remove new image
  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  // Remove existing image
  const removeExistingImage = (index) => {
    const newExisting = [...existingImages];
    newExisting.splice(index, 1);
    setExistingImages(newExisting);
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.banner.trim()) newErrors.banner = "Banner name is required";
    if (!form.position) newErrors.position = "Position is required";
    if (!form.createdBy.trim()) newErrors.createdBy = "Created by is required";
    if (mode === "create" && images.length === 0) {
      newErrors.images = "At least one image is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus({ loading: true, success: "", error: "" });

    try {
      const formData = new FormData();

      // Append all form fields
      Object.keys(form).forEach((key) => {
        if (form[key] !== "" && form[key] !== null) {
          formData.append(key, form[key]);
        }
      });

      // Append images
      images.forEach((image) => {
        formData.append("images", image);
      });

      if (mode === "edit" && adId) {
        await updateAd(adId, formData);
        setStatus({ loading: false, success: "Ad updated successfully!", error: "" });
      } else {
        await createAd(formData);
        setStatus({ loading: false, success: "Ad created successfully!", error: "" });
      }

      setTimeout(() => navigate("/ads/all"), 1500);
    } catch (err) {
      setStatus({
        loading: false,
        success: "",
        error: err.message || err.error || "Something went wrong",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">
            {mode === "edit" ? "Edit Ad" : "Create New Ad"}
          </h2>
          <p className="text-indigo-100 mt-1">
            {mode === "edit" ? "Update ad details" : "Fill in the details to create a new ad"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Status Messages */}
          {status.error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <AlertCircle size={20} />
              {status.error}
            </div>
          )}
          {status.success && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              {status.success}
            </div>
          )}

          {/* Basic Info Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FileText size={16} />
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter ad title"
                  className={inputClass("title")}
                  maxLength={150}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Banner URL */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Target size={16} />
                  Banner Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="banner"
                  value={form.banner}
                  onChange={handleChange}
                  placeholder="e.g., ACHS, KMC, etc."
                  className={inputClass("banner")}
                />
                {errors.banner && (
                  <p className="mt-1 text-sm text-red-500">{errors.banner}</p>
                )}
              </div>

              {/* Position */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin size={16} />
                  Position <span className="text-red-500">*</span>
                </label>
                <select
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  className={inputClass("position")}
                >
                  <option value="">Select Position</option>
                  {AD_POSITIONS.map((pos) => (
                    <option key={pos.value} value={pos.value}>
                      {pos.label}
                    </option>
                  ))}
                </select>
                {errors.position && (
                  <p className="mt-1 text-sm text-red-500">{errors.position}</p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className={inputClass("priority")}
                >
                  {AD_PRIORITIES.map((pri) => (
                    <option key={pri.value} value={pri.value}>
                      {pri.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={inputClass("status")}
                >
                  {AD_STATUSES.map((stat) => (
                    <option key={stat.value} value={stat.value}>
                      {stat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Created By */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  Created By <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="createdBy"
                  value={form.createdBy}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  className={inputClass("createdBy")}
                />
                {errors.createdBy && (
                  <p className="mt-1 text-sm text-red-500">{errors.createdBy}</p>
                )}
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Ad Images
            </h3>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Existing Images</label>
                <div className="flex flex-wrap gap-4">
                  {existingImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={`https://api.entrancegateway.com/images/${img}`}
                        alt={`Existing ${index + 1}`}
                        className="h-24 w-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload New Images */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Image size={16} />
                Upload Images {mode === "create" && <span className="text-red-500">*</span>}
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              {errors.images && (
                <p className="mt-1 text-sm text-red-500">{errors.images}</p>
              )}

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Schedule Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Schedule & Duration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar size={16} />
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className={inputClass("startDate")}
                />
              </div>

              {/* End Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar size={16} />
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className={inputClass("endDate")}
                />
              </div>

              {/* Display Schedule */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  Display Schedule
                </label>
                <input
                  type="text"
                  name="displaySchedule"
                  value={form.displaySchedule}
                  onChange={handleChange}
                  placeholder="e.g., Mon-Fri 9AM-5PM"
                  className={inputClass("displaySchedule")}
                  maxLength={200}
                />
              </div>
            </div>
          </div>

          {/* Budget Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Budget & Limits
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Budget */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <DollarSign size={16} />
                  Total Budget
                </label>
                <input
                  type="number"
                  name="totalBudget"
                  value={form.totalBudget}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={inputClass("totalBudget")}
                />
              </div>

              {/* Cost Per Click */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  Cost Per Click
                </label>
                <input
                  type="number"
                  name="costPerClick"
                  value={form.costPerClick}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={inputClass("costPerClick")}
                />
              </div>

              {/* Cost Per Impression */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  Cost Per Impression
                </label>
                <input
                  type="number"
                  name="costPerImpression"
                  value={form.costPerImpression}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={inputClass("costPerImpression")}
                />
              </div>

              {/* Max Impressions */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  Max Impressions
                </label>
                <input
                  type="number"
                  name="maxImpressions"
                  value={form.maxImpressions}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className={inputClass("maxImpressions")}
                />
              </div>

              {/* Max Clicks */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  Max Clicks
                </label>
                <input
                  type="number"
                  name="maxClicks"
                  value={form.maxClicks}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className={inputClass("maxClicks")}
                />
              </div>

              {/* Weight */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  Weight
                </label>
                <input
                  type="number"
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                  placeholder="1"
                  min="1"
                  className={inputClass("weight")}
                />
              </div>
            </div>
          </div>

          {/* Targeting Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Targeting
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Target Audience */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Target size={16} />
                  Target Audience
                </label>
                <input
                  type="text"
                  name="targetAudience"
                  value={form.targetAudience}
                  onChange={handleChange}
                  placeholder="e.g., Students, Professionals"
                  className={inputClass("targetAudience")}
                />
              </div>

              {/* Target Location */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin size={16} />
                  Target Location
                </label>
                <input
                  type="text"
                  name="targetLocation"
                  value={form.targetLocation}
                  onChange={handleChange}
                  placeholder="e.g., Nepal, Kathmandu"
                  className={inputClass("targetLocation")}
                  maxLength={100}
                />
              </div>

              {/* Target Devices */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Monitor size={16} />
                  Target Devices
                </label>
                <input
                  type="text"
                  name="targetDevices"
                  value={form.targetDevices}
                  onChange={handleChange}
                  placeholder="e.g., Mobile, Desktop, Tablet"
                  className={inputClass("targetDevices")}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Tag size={16} />
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="e.g., promo, discount, course"
                  className={inputClass("tags")}
                />
              </div>
            </div>
          </div>

          {/* Tracking Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Tracking & Analytics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tracking Pixel */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Tracking Pixel
                </label>
                <input
                  type="text"
                  name="trackingPixel"
                  value={form.trackingPixel}
                  onChange={handleChange}
                  placeholder="Tracking pixel URL"
                  className={inputClass("trackingPixel")}
                />
              </div>

              {/* UTM Parameters */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  UTM Parameters
                </label>
                <input
                  type="text"
                  name="utmParameters"
                  value={form.utmParameters}
                  onChange={handleChange}
                  placeholder="utm_source=entrance&utm_medium=banner"
                  className={inputClass("utmParameters")}
                />
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Additional Info
            </h3>

            <div>
              <label className="text-sm font-medium text-gray-700">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Internal notes about this ad..."
                rows={3}
                className={inputClass("notes")}
                maxLength={500}
              />
            </div>

            {/* Is Active */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="text-sm font-medium text-gray-700">
                Is Active
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/ads/all")}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status.loading}
              className={`flex-1 py-3 px-4 text-white rounded-lg font-medium transition-all duration-200 ${status.loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
                }`}
            >
              {status.loading
                ? "Saving..."
                : mode === "edit"
                  ? "Update Ad"
                  : "Create Ad"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdsForm;
