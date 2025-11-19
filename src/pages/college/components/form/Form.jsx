// CollegeForm.jsx - Simple & Responsive Nepal Colleges Manager
import React, { useState, useEffect } from "react";
import { Upload, Building2, MapPin, Globe, Calendar, University, Search, Trash2 } from "lucide-react";

const CollegeForm = (type,onSubmit) => {
  const [colleges, setColleges] = useState(() => {
    const saved = localStorage.getItem("nepaliColleges");
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    district: "",
    location: "",
    type: "affiliated",
    affiliatedBy: "",
    establishedYear: "",
    website: "",
    logo: null,
  });

  // Nepal Data
  const districts = [
    "Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Biratnagar", 
    "Birgunj", "Dharan", "Butwal", "Bharatpur", "Hetauda", 
    "Janakpur", "Nepalgunj", "Dhangadhi", "Tulsipur", "Itahari"
  ];

  const universities = [
    "Tribhuvan University (TU)", "Kathmandu University (KU)", 
    "Purbanchal University (PU)", "Pokhara University (PU)", 
    "Lumbini Buddhist University (LBU)", "Agriculture and Forestry University (AFU)",
    "Mid-Western University (MWU)", "Far-Western University (FWU)"
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo" && files[0]) {
      const file = files[0];
      setFormData(prev => ({ ...prev, logo: file }));

      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCollege = {
      id: Date.now(),
      ...formData,
      logoUrl: logoPreview,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };

    const updated = [...colleges, newCollege];
    setColleges(updated);
    localStorage.setItem("nepaliColleges", JSON.stringify(updated));

    // Reset form
    setFormData({
      name: "", district: "", location: "", type: "affiliated",
      affiliatedBy: "", establishedYear: "", website: "", logo: null
    });
    setLogoPreview(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const deleteCollege = (id) => {
    if (window.confirm("Delete this college?")) {
      const filtered = colleges.filter(c => c.id !== id);
      setColleges(filtered);
      localStorage.setItem("nepaliColleges", JSON.stringify(filtered));
    }
  };

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.affiliatedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
            <University className="text-blue-600" />
            Nepal Colleges
          </h1>
          <p className="text-gray-600 mt-2">Add and manage colleges easily</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg text-center font-medium">
            College added successfully!
          </div>
        )}

        {/* Add College Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New College</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Building2 className="inline w-4 h-4 mr-1" /> College Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Nepal Commerce Campus"
                />
              </div>

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
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="affiliated">Affiliated College</option>
                  <option value="constituent">Constituent Campus</option>
                  <option value="community">Community Campus</option>
                  <option value="private">Private College</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Affiliated University *</label>
                <select
                  name="affiliatedBy"
                  value={formData.affiliatedBy}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select University</option>
                  {universities.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>

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
                  <img src={logoPreview} alt="Logo preview" className="mt-3 h-20 w-20 object-contain rounded border" />
                )}
              </div>
            </div>

            <div className="pt-4 flex gap-3 justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Add College
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, name: "", district: "", location: "", website: "", establishedYear: "", logo: null })}
                className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Colleges List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">All Colleges ({colleges.length})</h2>
            
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search colleges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredColleges.length === 0 ? (
              <p className="text-center py-12 text-gray-500">
                {colleges.length === 0 ? "No colleges added yet." : "No match found."}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {filteredColleges.map((college) => (
                  <div key={college.id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      {college.logoUrl ? (
                        <img src={college.logoUrl} alt={college.name} className="h-14 w-14 object-contain rounded" />
                      ) : (
                        <div className="h-14 w-14 bg-gray-200 rounded flex items-center justify-center">
                          <University size={24} className="text-gray-400" />
                        </div>
                      )}
                      <button
                        onClick={() => deleteCollege(college.id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <h3 className="font-bold text-lg mt-3">{college.name}</h3>
                    <p className="text-sm text-gray-600">{college.type.replace("affiliated", "Affiliated")}</p>
                    <p className="text-sm text-gray-700 mt-2">
                      <MapPin size={14} className="inline mr-1" />
                      {college.location}, {college.district}
                    </p>
                    <p className="text-sm font-medium mt-1">{college.affiliatedBy}</p>
                    <p className="text-xs text-gray-500 mt-3">Added: {college.createdAt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeForm;