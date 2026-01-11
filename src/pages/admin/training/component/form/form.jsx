// TrainingForm.jsx
import { useState } from "react";
import { Calendar, MapPin, DollarSign, Users, Type, AlertCircle, Save, X, BookOpen, Link, Tag, Clock } from "lucide-react";

const TrainingForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    trainingName: "",
    description: "",
    startDate: "",
    endDate: "",
    trainingType: "ON_SITE",
    trainingStatus: "UPCOMING",
    trainingHours: "",
    location: "",
    maxParticipants: "",
    currentParticipants: "",
    trainingCategory: "",
    cost: "",
    certificateProvided: false,
    materialsLink: "",
    remarks: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.trainingName.trim()) newErrors.trainingName = "Training Name is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.startDate) newErrors.startDate = "Start Date is required";
    if (!form.endDate) newErrors.endDate = "End Date is required";
    if (form.startDate && form.endDate && form.startDate > form.endDate)
      newErrors.endDate = "End date must be after start date";
    if (!form.trainingHours || form.trainingHours <= 0) newErrors.trainingHours = "Must be a positive number";
    if (!form.maxParticipants || form.maxParticipants <= 0) newErrors.maxParticipants = "Must be a positive number";
    if (!form.cost || form.cost < 0) newErrors.cost = "Cannot be negative";
    if (form.materialsLink && !/^https?:\/\/.+/.test(form.materialsLink))
      newErrors.materialsLink = "Invalid URL";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
       // Scroll to top to see errors
       window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setErrors({});
    if (onSubmit) onSubmit(form);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* === General Information Section === */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
             <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
               <BookOpen className="w-5 h-5 text-blue-600" />
               Program Details
             </h2>
           </div>
           
           <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Training Name <span className="text-red-500">*</span></label>
                   <input
                     type="text"
                     name="trainingName"
                     value={form.trainingName}
                     onChange={handleChange}
                     className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all ${
                        errors.trainingName 
                        ? "border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50/30" 
                        : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"
                     }`}
                     placeholder="e.g. Advanced React Patterns"
                   />
                   {errors.trainingName && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.trainingName}</p>}
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
                   <textarea
                     name="description"
                     value={form.description}
                     onChange={handleChange}
                     className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all h-32 resize-y ${
                        errors.description 
                        ? "border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50/30" 
                        : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"
                     }`}
                     placeholder="Detailed description of the training program..."
                   />
                   {errors.description && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.description}</p>}
                </div>
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Training Category</label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                              type="text" 
                              name="trainingCategory" 
                              value={form.trainingCategory} 
                              onChange={handleChange} 
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" 
                              placeholder="e.g. Technology" 
                            />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Training Type</label>
                        <div className="relative">
                           <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                           <select 
                             name="trainingType" 
                             value={form.trainingType} 
                             onChange={handleChange} 
                             className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white"
                           >
                              <option value="ON_SITE">On Site</option>
                              <option value="ONLINE">Online</option>
                           </select>
                        </div>
                    </div>
                </div>
              </div>
           </div>
        </section>

        {/* === Schedule & Logistics === */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
             <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
               <Calendar className="w-5 h-5 text-orange-600" />
               Schedule & Logistics
             </h2>
           </div>
           
           <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Start Date <span className="text-red-500">*</span></label>
                   <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none ${errors.startDate ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-orange-500/20 focus:border-orange-500"}`} />
                   {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">End Date <span className="text-red-500">*</span></label>
                   <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none ${errors.endDate ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-orange-500/20 focus:border-orange-500"}`} />
                   {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                 </div>
                 
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Hours) <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="number" name="trainingHours" value={form.trainingHours} onChange={handleChange} className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 outline-none ${errors.trainingHours ? "border-red-300" : "border-gray-200 focus:ring-orange-500/20 focus:border-orange-500"}`} placeholder="e.g. 24" />
                    </div>
                    {errors.trainingHours && <p className="mt-1 text-sm text-red-600">{errors.trainingHours}</p>}
                 </div>
                 
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" placeholder="Enter venue or link" />
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* === Costs & Capacity === */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
             <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
               <Users className="w-5 h-5 text-purple-600" />
               Capacity & Pricing
             </h2>
           </div>
           
           <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Capacity <span className="text-red-500">*</span></label>
                    <input type="number" name="maxParticipants" value={form.maxParticipants} onChange={handleChange} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none ${errors.maxParticipants ? "border-red-300" : "border-gray-200 focus:ring-purple-500/20 focus:border-purple-500"}`} placeholder="e.g. 30" />
                    {errors.maxParticipants && <p className="mt-1 text-sm text-red-600">{errors.maxParticipants}</p>}
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Enrolled</label>
                    <input type="number" name="currentParticipants" value={form.currentParticipants} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" placeholder="e.g. 5" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost (NPR) <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="number" step="0.01" name="cost" value={form.cost} onChange={handleChange} className={`w-full pl-9 pr-4 py-3 border rounded-xl focus:ring-2 outline-none ${errors.cost ? "border-red-300" : "border-gray-200 focus:ring-purple-500/20 focus:border-purple-500"}`} placeholder="0.00" />
                    </div>
                    {errors.cost && <p className="mt-1 text-sm text-red-600">{errors.cost}</p>}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <input type="checkbox" name="certificateProvided" checked={form.certificateProvided} onChange={handleChange} className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                    <div>
                        <span className="block text-sm font-medium text-gray-900">Certificate Provided</span>
                        <span className="block text-xs text-gray-500">Will attendees receive a certificate?</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select name="trainingStatus" value={form.trainingStatus} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none bg-white">
                        <option value="UPCOMING">Upcoming</option>
                        <option value="ONGOING">Ongoing</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
              </div>
           </div>
        </section>

        {/* === Additional Info === */}
         <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Link className="w-5 h-5 text-teal-600" />
                  Resources & Notes
                </h2>
             </div>
             <div className="p-6 md:p-8 space-y-6">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Materials Link</label>
                   <input type="url" name="materialsLink" value={form.materialsLink} onChange={handleChange} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none ${errors.materialsLink ? "border-red-300" : "border-gray-200 focus:ring-teal-500/20 focus:border-teal-500"}`} placeholder="https://drive.google.com/..." />
                   {errors.materialsLink && <p className="mt-1 text-sm text-red-600">{errors.materialsLink}</p>}
                </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Remarks / Internal Notes</label>
                   <textarea name="remarks" value={form.remarks} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none h-24 resize-none" placeholder="Any special arrangements or internal notes..." />
                </div>
             </div>
         </section>

        {/* === Actions === */}
        <div className="flex justify-end pt-4 gap-4">
             <button type="button" className="px-6 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                <X className="w-4 h-4" /> Cancel
             </button>
             <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all flex items-center gap-2">
                <Save className="w-4 h-4" /> Create Training
             </button>
        </div>

      </form>
    </div>
  );
};

export default TrainingForm;
