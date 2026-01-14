// TrainingForm.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, DollarSign, Users, Type, AlertCircle, Save, X, BookOpen, Link, Tag, Clock, Percent } from "lucide-react";

const TrainingForm = ({ mode = "add", initialData = null, onSubmit }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    trainingName: "",
    description: "",
    startDate: "",
    endDate: "",
    trainingType: "REMOTE",
    trainingStatus: "UPCOMING",
    trainingHours: "",
    location: "",
    maxParticipants: "",
    currentParticipants: 0,
    trainingCategory: "",
    price: "",
    certificateProvided: false,
    materialsLink: "",
    remarks: "",
    offerPercentage: 0,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        trainingName: initialData.trainingName || "",
        description: initialData.description || "",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        trainingType: initialData.trainingType || "REMOTE",
        trainingStatus: initialData.trainingStatus || "UPCOMING",
        trainingHours: initialData.trainingHours || "",
        location: initialData.location || "",
        maxParticipants: initialData.maxParticipants || "",
        currentParticipants: initialData.currentParticipants || 0,
        trainingCategory: initialData.trainingCategory || "",
        price: initialData.price || "",
        certificateProvided: initialData.certificateProvided || false,
        materialsLink: initialData.materialsLink || "",
        remarks: initialData.remarks || "",
        offerPercentage: initialData.offerPercentage || 0,
      });
    }
  }, [mode, initialData]);

  const validate = () => {
    const newErrors = {};
    if (!form.trainingName.trim()) newErrors.trainingName = "Training Name is required";
    if (form.trainingName.length > 255) newErrors.trainingName = "Training Name must not exceed 255 characters";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (form.description.length > 2000) newErrors.description = "Description must not exceed 2000 characters";
    if (!form.startDate) newErrors.startDate = "Start Date is required";
    if (!form.endDate) newErrors.endDate = "End Date is required";
    if (form.startDate && form.endDate && form.startDate > form.endDate)
      newErrors.endDate = "End date must be after start date";
    if (!form.trainingHours || form.trainingHours <= 0) newErrors.trainingHours = "Must be a positive number";
    if (!form.maxParticipants || form.maxParticipants <= 0) newErrors.maxParticipants = "Must be a positive number";
    if (!form.price || form.price < 0) newErrors.price = "Price cannot be negative";
    if (form.currentParticipants < 0) newErrors.currentParticipants = "Cannot be negative";
    if (form.offerPercentage < 0 || form.offerPercentage > 100) newErrors.offerPercentage = "Must be between 0 and 100";
    if (form.materialsLink && !/^https?:\/\/.+/.test(form.materialsLink))
      newErrors.materialsLink = "Invalid URL";
    if (form.remarks && form.remarks.length > 1000) newErrors.remarks = "Remarks must not exceed 1000 characters";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    
    try {
      const payload = {
        ...form,
        trainingHours: parseInt(form.trainingHours),
        maxParticipants: parseInt(form.maxParticipants),
        currentParticipants: parseInt(form.currentParticipants),
        price: parseFloat(form.price),
        offerPercentage: parseInt(form.offerPercentage),
      };
      await onSubmit(payload);
    } catch (error) {
      setIsSubmitting(false);
    }
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
                     maxLength={255}
                     className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all ${
                        errors.trainingName 
                        ? "border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50/30" 
                        : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"
                     }`}
                     placeholder="e.g. Spring Boot Masterclass"
                   />
                   {errors.trainingName && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.trainingName}</p>}
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
                   <textarea
                     name="description"
                     value={form.description}
                     onChange={handleChange}
                     maxLength={2000}
                     className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all h-32 resize-y ${
                        errors.description 
                        ? "border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50/30" 
                        : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"
                     }`}
                     placeholder="Comprehensive training covering all aspects..."
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
                              placeholder="e.g. Software Development" 
                            />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Training Type <span className="text-red-500">*</span></label>
                        <div className="relative">
                           <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                           <select 
                             name="trainingType" 
                             value={form.trainingType} 
                             onChange={handleChange} 
                             className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white"
                           >
                              <option value="REMOTE">Remote</option>
                              <option value="ON_SITE">On Site</option>
                              <option value="HYBRID">Hybrid</option>
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
                        <input type="number" name="trainingHours" value={form.trainingHours} onChange={handleChange} min="0" className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 outline-none ${errors.trainingHours ? "border-red-300" : "border-gray-200 focus:ring-orange-500/20 focus:border-orange-500"}`} placeholder="e.g. 120" />
                    </div>
                    {errors.trainingHours && <p className="mt-1 text-sm text-red-600">{errors.trainingHours}</p>}
                 </div>
                 
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" placeholder="Kathmandu, Nepal" />
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
                    <input type="number" name="maxParticipants" value={form.maxParticipants} onChange={handleChange} min="0" className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none ${errors.maxParticipants ? "border-red-300" : "border-gray-200 focus:ring-purple-500/20 focus:border-purple-500"}`} placeholder="e.g. 50" />
                    {errors.maxParticipants && <p className="mt-1 text-sm text-red-600">{errors.maxParticipants}</p>}
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Enrolled</label>
                    <input type="number" name="currentParticipants" value={form.currentParticipants} onChange={handleChange} min="0" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none" placeholder="e.g. 25" />
                    {errors.currentParticipants && <p className="mt-1 text-sm text-red-600">{errors.currentParticipants}</p>}
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (NPR) <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} min="0" className={`w-full pl-9 pr-4 py-3 border rounded-xl focus:ring-2 outline-none ${errors.price ? "border-red-300" : "border-gray-200 focus:ring-purple-500/20 focus:border-purple-500"}`} placeholder="25000.00" />
                    </div>
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-50">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <input type="checkbox" name="certificateProvided" checked={form.certificateProvided} onChange={handleChange} className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                    <div>
                        <span className="block text-sm font-medium text-gray-900">Certificate Provided</span>
                        <span className="block text-xs text-gray-500">Will attendees receive a certificate?</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status <span className="text-red-500">*</span></label>
                    <select name="trainingStatus" value={form.trainingStatus} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none bg-white">
                        <option value="UPCOMING">Upcoming</option>
                        <option value="FLASH_SALE">Flash Sale</option>
                        <option value="ONGOING">Ongoing</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="POSTPONED">Postponed</option>
                        <option value="COMING_SOON">Coming Soon</option>
                        <option value="REGISTRATION_OPEN">Registration Open</option>
                        <option value="REGISTRATION_CLOSED">Registration Closed</option>
                        <option value="SOLD_OUT">Sold Out</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Offer Percentage</label>
                    <div className="relative">
                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="number" name="offerPercentage" value={form.offerPercentage} onChange={handleChange} min="0" max="100" className={`w-full pl-9 pr-4 py-3 border rounded-xl focus:ring-2 outline-none ${errors.offerPercentage ? "border-red-300" : "border-gray-200 focus:ring-purple-500/20 focus:border-purple-500"}`} placeholder="0" />
                    </div>
                    {errors.offerPercentage && <p className="mt-1 text-sm text-red-600">{errors.offerPercentage}</p>}
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
                   <input type="url" name="materialsLink" value={form.materialsLink} onChange={handleChange} className={`w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none ${errors.materialsLink ? "border-red-300" : "border-gray-200 focus:ring-teal-500/20 focus:border-teal-500"}`} placeholder="https://materials.example.com/..." />
                   {errors.materialsLink && <p className="mt-1 text-sm text-red-600">{errors.materialsLink}</p>}
                </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Remarks / Internal Notes</label>
                   <textarea name="remarks" value={form.remarks} onChange={handleChange} maxLength={1000} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none h-24 resize-none" placeholder="Any special arrangements or internal notes..." />
                </div>
             </div>
         </section>

        {/* === Actions === */}
        <div className="flex justify-end pt-4 gap-4">
             <button 
               type="button" 
               onClick={() => navigate("/admin/training")}
               className="px-6 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
             >
                <X className="w-4 h-4" /> Cancel
             </button>
             <button 
               type="submit" 
               disabled={isSubmitting}
               className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <Save className="w-4 h-4" /> {isSubmitting ? "Saving..." : mode === "edit" ? "Update Training" : "Create Training"}
             </button>
        </div>

      </form>
    </div>
  );
};

export default TrainingForm;
