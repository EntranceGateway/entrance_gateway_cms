import { useState } from "react";

const NoteForm = () => {
  const [form, setForm] = useState({
    subject: "",
    subjectCode: "",
    noteName: "",
    noteDescription: "",
    courseId: "",
    pdfFile: null,
  });

  // text inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }
    setForm({ ...form, pdfFile: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.subject || !form.subjectCode || !form.noteName) {
      alert("Fill the required fields.");
      return;
    }

    console.log("Form Submitted:", form);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Create Note</h2>

      <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
        
        {/* Subject */}
        <div>
          <label className="block text-sm font-medium mb-1">Subject *</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Enter subject"
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Subject Code */}
        <div>
          <label className="block text-sm font-medium mb-1">Subject Code *</label>
          <input
            type="text"
            name="subjectCode"
            value={form.subjectCode}
            onChange={handleChange}
            placeholder="e.g., CS101"
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Note Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Note Name *</label>
          <input
            type="text"
            name="noteName"
            value={form.noteName}
            onChange={handleChange}
            placeholder="Enter note name"
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Course ID */}
        <div>
          <label className="block text-sm font-medium mb-1">Course ID</label>
          <input
            type="text"
            name="courseId"
            value={form.courseId}
            onChange={handleChange}
            placeholder="Enter course ID"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Note Description */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Note Description</label>
          <textarea
            name="noteDescription"
            value={form.noteDescription}
            onChange={handleChange}
            placeholder="Write description..."
            className="w-full border px-3 py-2 rounded h-32"
          ></textarea>
        </div>

        {/* PDF Upload */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Upload PDF *</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full border px-3 py-2 rounded bg-gray-50"
          />
          <p className="text-xs text-gray-600 mt-1">Only PDF file is allowed.</p>
        </div>

        {/* Submit Button */}
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Submit Note
          </button>
        </div>

      </form>
    </div>
  );
};

export default NoteForm;
