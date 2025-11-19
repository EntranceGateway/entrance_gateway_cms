// TrainingForm.jsx
import { useState } from "react";

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
    if (!form.trainingName.trim()) newErrors.trainingName = "Required";
    if (!form.description.trim()) newErrors.description = "Required";
    if (!form.startDate) newErrors.startDate = "Required";
    if (!form.endDate) newErrors.endDate = "Required";
    if (form.startDate && form.endDate && form.startDate > form.endDate)
      newErrors.endDate = "End date must be after start date";
    if (!form.trainingHours || form.trainingHours <= 0) newErrors.trainingHours = "Must be positive";
    if (!form.maxParticipants || form.maxParticipants <= 0) newErrors.maxParticipants = "Must be positive";
    if (!form.cost || form.cost < 0) newErrors.cost = "Cannot be negative";
    if (form.materialsLink && !/^https?:\/\/.+/.test(form.materialsLink))
      newErrors.materialsLink = "Invalid URL";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    if (onSubmit) onSubmit(form);
  };

  const inputClass = (error) =>
    `w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
      error ? "border-red-500" : "border-gray-300"
    }`;

  const labelClass = "block font-semibold text-gray-700 mb-1";

  const errorClass = "text-red-500 text-sm mt-1";

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Create Training</h2>
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
        {/* Training Name */}
        <div className="sm:col-span-2">
          <label className={labelClass}>Training Name *</label>
          <input
            type="text"
            name="trainingName"
            value={form.trainingName}
            onChange={handleChange}
            className={inputClass(errors.trainingName)}
            placeholder="CI/Automation with GitHub Actions"
          />
          {errors.trainingName && <p className={errorClass}>{errors.trainingName}</p>}
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className={labelClass}>Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className={inputClass(errors.description) + " h-24"}
            placeholder="Learn to automate build, test, and deployment workflows."
          />
          {errors.description && <p className={errorClass}>{errors.description}</p>}
        </div>

        {/* Dates */}
        <div>
          <label className={labelClass}>Start Date *</label>
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className={inputClass(errors.startDate)} />
          {errors.startDate && <p className={errorClass}>{errors.startDate}</p>}
        </div>
        <div>
          <label className={labelClass}>End Date *</label>
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className={inputClass(errors.endDate)} />
          {errors.endDate && <p className={errorClass}>{errors.endDate}</p>}
        </div>

        {/* Training Type & Status */}
        <div>
          <label className={labelClass}>Training Type</label>
          <select name="trainingType" value={form.trainingType} onChange={handleChange} className={inputClass()}>
            <option value="ON_SITE">On Site</option>
            <option value="ONLINE">Online</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Training Status</label>
          <select name="trainingStatus" value={form.trainingStatus} onChange={handleChange} className={inputClass()}>
            <option value="UPCOMING">Upcoming</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Hours & Cost */}
        <div>
          <label className={labelClass}>Training Hours *</label>
          <input type="number" name="trainingHours" value={form.trainingHours} onChange={handleChange} className={inputClass(errors.trainingHours)} placeholder="10" />
          {errors.trainingHours && <p className={errorClass}>{errors.trainingHours}</p>}
        </div>
        <div>
          <label className={labelClass}>Cost *</label>
          <input type="number" step="0.01" name="cost" value={form.cost} onChange={handleChange} className={inputClass(errors.cost)} placeholder="79.99" />
          {errors.cost && <p className={errorClass}>{errors.cost}</p>}
        </div>

        {/* Location & Participants */}
        <div>
          <label className={labelClass}>Location</label>
          <input type="text" name="location" value={form.location} onChange={handleChange} className={inputClass()} placeholder="Kathmandu Tech Hub" />
        </div>
        <div>
          <label className={labelClass}>Max Participants *</label>
          <input type="number" name="maxParticipants" value={form.maxParticipants} onChange={handleChange} className={inputClass(errors.maxParticipants)} placeholder="30" />
          {errors.maxParticipants && <p className={errorClass}>{errors.maxParticipants}</p>}
        </div>
        <div>
          <label className={labelClass}>Current Participants</label>
          <input type="number" name="currentParticipants" value={form.currentParticipants} onChange={handleChange} className={inputClass()} placeholder="8" />
        </div>

        {/* Category */}
        <div>
          <label className={labelClass}>Training Category</label>
          <input type="text" name="trainingCategory" value={form.trainingCategory} onChange={handleChange} className={inputClass()} placeholder="DevOps" />
        </div>

        {/* Certificate */}
        <div className="flex items-center space-x-2 mt-4 sm:col-span-2">
          <input type="checkbox" name="certificateProvided" checked={form.certificateProvided} onChange={handleChange} className="h-4 w-4" />
          <label className="text-gray-700 font-medium">Certificate Provided</label>
        </div>

        {/* Materials Link */}
        <div className="sm:col-span-2">
          <label className={labelClass}>Materials Link</label>
          <input type="url" name="materialsLink" value={form.materialsLink} onChange={handleChange} className={inputClass(errors.materialsLink)} placeholder="https://example.com/guide" />
          {errors.materialsLink && <p className={errorClass}>{errors.materialsLink}</p>}
        </div>

        {/* Remarks */}
        <div className="sm:col-span-2">
          <label className={labelClass}>Remarks</label>
          <textarea name="remarks" value={form.remarks} onChange={handleChange} className={inputClass() + " h-20"} placeholder="Bring your laptop. Lunch provided." />
        </div>

        {/* Submit */}
        <div className="sm:col-span-2">
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
            Create Training
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrainingForm;
