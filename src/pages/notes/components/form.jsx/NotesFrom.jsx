import { useState } from "react";

const NoteForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    subject: "",
    subjectCode: "",
    noteName: "",
    noteDescription: "",
    courseId: "",
    pdfFile: null,
  });

  const [errors, setErrors] = useState({});

  // -------------------------------
  // Handlers
  // -------------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      setErrors({ ...errors, pdfFile: "Only PDF files allowed" });
      return;
    }
    setForm({ ...form, pdfFile: file || null });
    setErrors({ ...errors, pdfFile: "" });
  };

  // -------------------------------
  // Validation
  // -------------------------------
  const validate = () => {
    let temp = {};

    if (!form.subject.trim()) temp.subject = "Subject is required.";
    else if (typeof form.subject !== "string") temp.subject = "Subject must be text.";

    if (!form.subjectCode.trim()) temp.subjectCode = "Subject code is required.";
    else if (typeof form.subjectCode !== "string") temp.subjectCode = "Subject code must be text.";

    if (!form.noteName.trim()) temp.noteName = "Note name is required.";
    else if (typeof form.noteName !== "string") temp.noteName = "Note name must be text.";

    if (form.pdfFile === null) temp.pdfFile = "PDF file is required.";
    else if (form.pdfFile.type !== "application/pdf") temp.pdfFile = "Only PDF allowed.";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit?.(form);
    console.log("Form Submitted:", form);
  };

  const inputBorder = (field) => {
    if (errors[field]) return "border-red-500";
    if (form[field] && !errors[field]) return "border-green-500";
    return "border-gray-300";
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-6">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 border-b pb-2">Create Note</h2>

      <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Enter subject"
            className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputBorder("subject")}`}
          />
          {errors.subject && <span className="text-red-600 text-sm">{errors.subject}</span>}
        </div>

        {/* Subject Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code *</label>
          <input
            type="text"
            name="subjectCode"
            value={form.subjectCode}
            onChange={handleChange}
            placeholder="e.g., CS101"
            className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputBorder("subjectCode")}`}
          />
          {errors.subjectCode && <span className="text-red-600 text-sm">{errors.subjectCode}</span>}
        </div>

        {/* Note Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Note Name *</label>
          <input
            type="text"
            name="noteName"
            value={form.noteName}
            onChange={handleChange}
            placeholder="Enter note name"
            className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputBorder("noteName")}`}
          />
          {errors.noteName && <span className="text-red-600 text-sm">{errors.noteName}</span>}
        </div>

        {/* Course ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course ID</label>
          <input
            type="text"
            name="courseId"
            value={form.courseId}
            onChange={handleChange}
            placeholder="Enter course ID"
            className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputBorder("courseId")}`}
          />
        </div>

        {/* Note Description */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Note Description</label>
          <textarea
            name="noteDescription"
            value={form.noteDescription}
            onChange={handleChange}
            placeholder="Write description..."
            className="w-full border px-3 py-2 rounded-lg h-32 focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* PDF Upload */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload PDF *</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className={`w-full border px-3 py-2 rounded-lg bg-gray-50 ${inputBorder("pdfFile")}`}
          />
          {errors.pdfFile && <span className="text-red-600 text-sm">{errors.pdfFile}</span>}
        </div>

        {/* Submit */}
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
          >
            Submit Note
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;
