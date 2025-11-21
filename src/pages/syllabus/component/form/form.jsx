import { useState } from "react";
import axios from "axios";

const AdminSyllabusForm = () => {
  const [form, setForm] = useState({
    syllabusTitle: "",
    courseCode: "",
    creditHours: "",
    lectureHours: "",
    tutorialHours: "",
    practicalHours: "",
    programName: "",
    semester: "",
    syllabusFile: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // -------------------------------
  // Input change handler
  // -------------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, syllabusFile: file });
    setErrors({ ...errors, syllabusFile: "" });
  };

  // -------------------------------
  // VALIDATION
  // -------------------------------
  const validate = () => {
    let temp = {};

    // Syllabus Title (string)
    if (!form.syllabusTitle.trim()) temp.syllabusTitle = "Syllabus title is required.";
    else if (typeof form.syllabusTitle !== "string") temp.syllabusTitle = "Syllabus title must be text.";
    else if (form.syllabusTitle.length < 3) temp.syllabusTitle = "Title must be at least 3 characters.";

    // Course Code (string)
    if (!form.courseCode.trim()) temp.courseCode = "Course code is required.";
    else if (typeof form.courseCode !== "string") temp.courseCode = "Course code must be text.";
    else if (!/^[A-Z]{2,4}\d{3}$/.test(form.courseCode)) temp.courseCode = "Use format like CS499.";

    // Credit Hours (number)
    if (form.creditHours === "" || isNaN(form.creditHours)) temp.creditHours = "Credit hours must be a number.";
    else if (form.creditHours <= 0) temp.creditHours = "Credit hours must be greater than 0.";

    // Lecture Hours (number)
    if (form.lectureHours === "" || isNaN(form.lectureHours)) temp.lectureHours = "Lecture hours must be a number.";
    else if (form.lectureHours < 0) temp.lectureHours = "Invalid number.";

    // Tutorial Hours (number)
    if (form.tutorialHours === "" || isNaN(form.tutorialHours)) temp.tutorialHours = "Tutorial hours must be a number.";
    else if (form.tutorialHours < 0) temp.tutorialHours = "Invalid number.";

    // Practical Hours (number)
    if (form.practicalHours === "" || isNaN(form.practicalHours)) temp.practicalHours = "Practical hours must be a number.";
    else if (form.practicalHours < 0) temp.practicalHours = "Invalid number.";

    // Program Name (string)
    if (!form.programName.trim()) temp.programName = "Program name is required.";
    else if (typeof form.programName !== "string") temp.programName = "Program name must be text.";

    // Semester (number)
    if (form.semester === "" || isNaN(form.semester)) temp.semester = "Semester must be a number.";
    else if (form.semester < 1 || form.semester > 12) temp.semester = "Semester must be 1–12.";

    // File (PDF)
    if (!form.syllabusFile) temp.syllabusFile = "Upload a PDF.";
    else if (form.syllabusFile.type !== "application/pdf") temp.syllabusFile = "Only PDF allowed.";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // -------------------------------
  // SUBMIT
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    try {
      const response = await axios.post(
        "http://your-api-url.com/api/v1/syllabus", // <-- change to your backend
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(response.data);
      alert("Syllabus submitted!");
    } catch (error) {
      console.error(error);
      alert("Submission failed!");
    }

    setLoading(false);
  };

  // -------------------------------
  // Border color logic
  // -------------------------------
  const inputBorder = (field) => {
    if (errors[field]) return "border-red-500";
    if (form[field] && !errors[field]) return "border-green-500";
    return "border-gray-300";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-blue-700 border-b pb-3">Add New Syllabus</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Syllabus Title */}
          <div>
            <label className="font-semibold">Syllabus Title</label>
            <input
              name="syllabusTitle"
              value={form.syllabusTitle}
              onChange={handleChange}
              className={`w-full mt-1 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputBorder(
                "syllabusTitle"
              )}`}
              placeholder="Quantum Computing Fundamentals"
            />
            {errors.syllabusTitle && <span className="text-red-600 text-sm block">{errors.syllabusTitle}</span>}
          </div>

          {/* Course Code */}
          <div>
            <label className="font-semibold">Course Code</label>
            <input
              name="courseCode"
              value={form.courseCode}
              onChange={handleChange}
              className={`w-full mt-1 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputBorder(
                "courseCode"
              )}`}
              placeholder="CS499"
            />
            {errors.courseCode && <span className="text-red-600 text-sm block">{errors.courseCode}</span>}
          </div>

          {/* Credit Hours */}
          <div>
            <label className="font-semibold">Credit Hours</label>
            <input
              type="number"
              name="creditHours"
              value={form.creditHours}
              onChange={handleChange}
              className={`w-full mt-1 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 ${inputBorder(
                "creditHours"
              )}`}
              placeholder="4"
            />
            {errors.creditHours && <span className="text-red-600 text-sm block">{errors.creditHours}</span>}
          </div>

          {/* Lecture Hours */}
          <div>
            <label className="font-semibold">Lecture Hours</label>
            <input
              type="number"
              name="lectureHours"
              value={form.lectureHours}
              onChange={handleChange}
              className={`w-full mt-1 p-3 rounded-lg ${inputBorder("lectureHours")}`}
              placeholder="3"
            />
            {errors.lectureHours && <span className="text-red-600 text-sm block">{errors.lectureHours}</span>}
          </div>

          {/* Tutorial Hours */}
          <div>
            <label className="font-semibold">Tutorial Hours</label>
            <input
              type="number"
              name="tutorialHours"
              value={form.tutorialHours}
              onChange={handleChange}
              className={`w-full mt-1 p-3 rounded-lg ${inputBorder("tutorialHours")}`}
              placeholder="1"
            />
            {errors.tutorialHours && <span className="text-red-600 text-sm block">{errors.tutorialHours}</span>}
          </div>

          {/* Practical Hours */}
          <div>
            <label className="font-semibold">Practical Hours</label>
            <input
              type="number"
              name="practicalHours"
              value={form.practicalHours}
              onChange={handleChange}
              className={`w-full mt-1 p-3 rounded-lg ${inputBorder("practicalHours")}`}
              placeholder="0"
            />
            {errors.practicalHours && <span className="text-red-600 text-sm block">{errors.practicalHours}</span>}
          </div>

          {/* Program Name */}
          <div>
            <label className="font-semibold">Program Name</label>
            <input
              name="programName"
              value={form.programName}
              onChange={handleChange}
              className={`w-full mt-1 p-3 rounded-lg ${inputBorder("programName")}`}
              placeholder="B.S. Computer Engineering"
            />
            {errors.programName && <span className="text-red-600 text-sm block">{errors.programName}</span>}
          </div>

          {/* Semester */}
          <div>
            <label className="font-semibold">Semester</label>
            <input
              type="number"
              name="semester"
              value={form.semester}
              onChange={handleChange}
              className={`w-full mt-1 p-3 rounded-lg ${inputBorder("semester")}`}
              placeholder="7"
            />
            {errors.semester && <span className="text-red-600 text-sm block">{errors.semester}</span>}
          </div>

        </div>

        {/* PDF Upload */}
        <div>
          <label className="font-semibold">Upload Syllabus (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="mt-2"
          />
          {errors.syllabusFile && <span className="text-red-600 text-sm block">{errors.syllabusFile}</span>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white rounded-lg font-semibold ${
            loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AdminSyllabusForm;
