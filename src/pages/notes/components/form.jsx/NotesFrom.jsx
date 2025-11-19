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

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf")
      return alert("Only PDF files allowed");

    setForm((prev) => ({ ...prev, pdfFile: file || null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // === Validation ===
    if (!form.subject.trim()) return alert("Subject is required");
    if (!form.subjectCode.trim()) return alert("Subject code is required");
    if (!form.noteName.trim()) return alert("Note name is required");
    if (!form.pdfFile) return alert("PDF file is required");

    // Call parent handler
    onSubmit?.(form);

    console.log("Form Submitted:", form);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Create Note</h2>

      <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
        
        <div>
          <label className="block text-sm font-medium mb-1">Subject *</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Enter subject"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subject Code *</label>
          <input
            type="text"
            name="subjectCode"
            value={form.subjectCode}
            onChange={handleChange}
            placeholder="e.g., CS101"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Note Name *</label>
          <input
            type="text"
            name="noteName"
            value={form.noteName}
            onChange={handleChange}
            placeholder="Enter note name"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

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

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">Upload PDF *</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full border px-3 py-2 rounded bg-gray-50"
          />
        </div>

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
