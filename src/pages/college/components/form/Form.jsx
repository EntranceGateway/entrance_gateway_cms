import React, { useState } from "react";
import { Upload, Building2, MapPin, Globe, Calendar, University, Mail, Phone } from "lucide-react";
import { createColleges } from "../../../../http/colleges";

const CollegeForm = () => {
  const [formData, setFormData] = useState({
    collegeName: "",
    district: "",
    location: "",
    email: "",
    contact: "",
    collegeType: "affiliated",
    affiliation: "",
    establishedYear: "",
    website: "",
    description: "",
    logo: null,
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo" && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, logo: file }));

      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.description.trim()) {
      setError("Description is required");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) payload.append(key, value);
      });

      await createColleges(payload, token);
      setShowSuccess(true);
      setFormData({
        collegeName: "",
        district: "",
        location: "",
        email: "",
        contact: "",
        collegeType: "affiliated",
        affiliation: "",
        establishedYear: "",
        website: "",
        description: "",
        logo: null,
      });
      setLogoPreview(null);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add college");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex justify-center">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3 mb-4">
          <University className="text-blue-600" /> Add New College
        </h1>

        {showSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg text-center font-medium mb-4">
            College added successfully!
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-lg text-center font-medium mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* College Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Building2 className="inline w-4 h-4 mr-1" /> College Name *
              </label>
              <input
                type="text"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Nepal Commerce Campus"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="inline w-4 h-4 mr-1" /> Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="example@college.edu.np"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="inline w-4 h-4 mr-1" /> Contact *
              </label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+977-9800000000"
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="inline w-4 h-4 mr-1" /> District *
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose District</option>
                <option value="Kathmandu">Kathmandu</option>
                <option value="Lalitpur">Lalitpur</option>
                <option value="Bhaktapur">Bhaktapur</option>
                <option value="Pokhara">Pokhara</option>
                <option value="Biratnagar">Biratnagar</option>
                <option value="Birgunj">Birgunj</option>
                <option value="Dharan">Dharan</option>
                <option value="Butwal">Butwal</option>
                <option value="Bharatpur">Bharatpur</option>
                <option value="Hetauda">Hetauda</option>
                <option value="Janakpur">Janakpur</option>
                <option value="Nepalgunj">Nepalgunj</option>
                <option value="Dhangadhi">Dhangadhi</option>
                <option value="Tulsipur">Tulsipur</option>
                <option value="Itahari">Itahari</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Minbhawan, Kathmandu"
              />
            </div>

            {/* College Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                name="collegeType"
                value={formData.collegeType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose Campus</option>
                <option value="COMMUNITY">Community Campus</option>
                <option value="PRIVATE">Private College</option>
                <option value="GOVERNMENT">Government College</option>

                GOVERNMENT
              </select>
            </div>

            {/* Affiliation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Affiliation *</label>
              <input
                type="text"
                name="affiliation"
                value={formData.affiliation}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Tribhuvan University"
              />
            </div>

            {/* Established Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline w-4 h-4 mr-1" /> Established Year
              </label>
              <input
                type="number"
                name="establishedYear"
                value={formData.establishedYear}
                onChange={handleChange}
                min="1900"
                max="2025"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g. 1959"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Globe className="inline w-4 h-4 mr-1" /> Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="https://example.edu.np"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter college description"
              />
            </div>

            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Upload className="inline w-4 h-4 mr-1" /> College Logo
              </label>
              <input
                type="file"
                name="logo"
                onChange={handleChange}
                accept="image/*"
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="mt-3 h-20 w-20 object-contain rounded border"
                />
              )}
            </div>
          </div>

          <div className="pt-4 flex gap-3 justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Adding..." : "Add College"}
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  collegeName: "",
                  district: "",
                  location: "",
                  email: "",
                  contact: "",
                  collegeType: "affiliated",
                  affiliation: "",
                  establishedYear: "",
                  website: "",
                  description: "",
                  logo: null,
                })
              }
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollegeForm;
