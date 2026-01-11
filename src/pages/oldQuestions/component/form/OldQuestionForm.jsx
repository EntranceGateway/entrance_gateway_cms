// src/pages/oldQuestions/component/form/OldQuestionForm.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../../../../http/course";
import { getSyllabusByAffiliationAndCourse } from "../../../../http/syllabus";
import PageHeader from "@/components/common/PageHeader";
import { BookOpen, AlertCircle, Save, FileText, Upload } from "lucide-react";

const DEFAULT_FORM = {
  affiliation: "",
  setName: "",
  description: "",
  year: "",
  syllabusId: "",
  courseId: "",
  file: null,
  existingPdfPath: "",
};

const AFFILIATIONS = [
  { value: "TRIBHUVAN_UNIVERSITY", label: "Tribhuvan University" },
  { value: "POKHARA_UNIVERSITY", label: "Pokhara University" },
  { value: "KATHMANDU_UNIVERSITY", label: "Kathmandu University" },
  { value: "PURWANCHAL_UNIVERSITY", label: "Purwanchal University" },
  { value: "MID_WESTERN_UNIVERSITY", label: "Mid Western University" },
  { value: "FAR_WESTERN_UNIVERSITY", label: "Far Western University" },
  { value: "LUMBINI_UNIVERSITY", label: "Lumbini University" },
  { value: "CAMPUS_AFFILIATED_TO_FOREIGN_UNIVERSITY", label: "Foreign University" },
];

const validateForm = (form, mode) => {
  const errors = {};
  if (!form.affiliation) errors.affiliation = "Affiliation is required";
  if (!form.setName.trim()) errors.setName = "Set name is required";
  if (!form.year || form.year < 1990 || form.year > 2100) errors.year = "Valid year (1990-2100) required";
  if (!form.syllabusId) errors.syllabusId = "Syllabus is required";
  if (!form.courseId) errors.courseId = "Course is required";
  if (mode === "add" && !form.file) errors.file = "PDF file is required";
  return errors;
};

const OldQuestionForm = ({ mode = "add", initialData = null, onSubmit }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, success: "" });

  const [courses, setCourses] = useState([]);
  const [syllabi, setSyllabi] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingSyllabi, setLoadingSyllabi] = useState(false);
  const [allCourses, setAllCourses] = useState([]);

  // Fetch all courses on mount
  useEffect(() => {
    const fetchAllCourses = async () => {
      setLoadingCourses(true);
      try {
        const res = await getCourses({ size: 100 });
        const data = res.data.data?.content || res.data.data || [];
        setAllCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
      setLoadingCourses(false);
    };
    fetchAllCourses();
  }, []);

  // Filter courses when affiliation changes
  useEffect(() => {
    if (!form.affiliation) {
      setCourses([]);
      return;
    }
    const filtered = allCourses.filter((c) => c.affiliation === form.affiliation);
    setCourses(filtered);
  }, [form.affiliation, allCourses]);

  // Fetch syllabus when course changes
  useEffect(() => {
    const fetchSyllabi = async () => {
      if (!form.courseId || !form.affiliation) {
        setSyllabi([]);
        return;
      }

      const selectedCourse = allCourses.find(c => String(c.courseId) === String(form.courseId));
      if (!selectedCourse) return;

      setLoadingSyllabi(true);
      try {
        const res = await getSyllabusByAffiliationAndCourse({
           affiliation: form.affiliation,
           courseName: selectedCourse.courseName,
           size: 100 // ensure we get enough
        });
        
        // Handle paginated response structure
        const rawContent = res.data?.data?.content || res.data?.content || [];
        
        // Map to simpler structure
        const parsedSyllabi = rawContent.map(s => ({
            syllabusId: s.id, // Use actual ID
            subjectName: s.subject,
            semester: s.semester,
            year: s.year
        }));

        setSyllabi(parsedSyllabi);
      } catch (err) {
        console.error("Error fetching syllabi:", err);
        setSyllabi([]);
      }
      setLoadingSyllabi(false);
    };
    fetchSyllabi();
  }, [form.courseId, form.affiliation, allCourses]);

  // Load initial data
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        ...DEFAULT_FORM,
        setName: initialData.setName || "",
        description: initialData.description || "",
        year: initialData.year?.toString() || "",
        syllabusId: initialData.syllabusId || "",
        courseId: initialData.courseId || "",
        existingPdfPath: initialData.pdfFilePath || "",
        affiliation: initialData.affiliation || "", // Ensure affiliation is loaded if present
        file: null,
      });
      // Trigger course filtering if affiliation exists (might need slight delay or manual trigger if dependent on allCourses async load)
      // useEffect deps handle it once allCourses loads? check overlap
    } else {
      setForm(DEFAULT_FORM);
    }
    setErrors({});
    setStatus({ loading: false, success: "" });
  }, [mode, initialData]);

  const inputClass = useCallback(
    (field) =>
      `block w-full rounded-xl border px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
        errors[field] ? "border-red-300 ring-red-200" : "border-gray-200 bg-gray-50/50 focus:bg-white"
      }`,
    [errors]
  );

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    if (name === "affiliation") {
      setForm((prev) => ({ ...prev, affiliation: value, courseId: "", syllabusId: "" }));
    } else if (name === "courseId") {
      setForm((prev) => ({ ...prev, courseId: value, syllabusId: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: type === "file" ? files[0] || null : value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm(form, mode);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus({ loading: true, success: "" });
    try {
      const fd = new FormData();
      const requestData = {
        setName: form.setName.trim(),
        description: form.description.trim(),
        year: parseInt(form.year),
        syllabusId: form.syllabusId,
        courseId: form.courseId,
      };
      
      fd.append("data", new Blob([JSON.stringify(requestData)], { type: "application/json" }));
      if (form.file) fd.append("file", form.file);

      await onSubmit(fd);
      setStatus({ loading: false, success: mode === "add" ? "Collection created!" : "Collection updated!" });
      setTimeout(() => navigate("/old-questions/all"), 1500);
    } catch (err) {
      setStatus({ loading: false, success: "" });
      const msg = err.response?.data?.message || err.message || "Failed to save";
       setErrors((prev) => ({ ...prev, global: msg }));
    }
  };

  return (
    <div className="w-full">
      <PageHeader
        title={mode === "add" ? "Add Question Collection" : "Edit Question Collection"}
        subtitle={mode === "add" ? "Upload new past questions" : "Update collection details"}
        breadcrumbs={[
            { label: "Old Questions", to: "/old-questions/all" },
            { label: mode === "add" ? "Add" : "Edit" }
        ]}
        icon={BookOpen}
      />

      <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden p-8">
        {status.success && (
            <div className="mb-6 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-800 text-sm flex items-center gap-2">
            <Save size={16} />
            {status.success}
            </div>
        )}
        {errors.global && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-800 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {errors.global}
            </div>
        )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Affiliation & Course */}
        <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Affiliation <span className="text-red-500">*</span></label>
              <select name="affiliation" value={form.affiliation} onChange={handleChange} className={inputClass("affiliation")}>
                <option value="">Select Affiliation</option>
                {AFFILIATIONS.map((aff) => <option key={aff.value} value={aff.value}>{aff.label}</option>)}
              </select>
               {errors.affiliation && <p className="text-xs text-red-600 mt-1 flex items-center gap-1">{errors.affiliation}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Course <span className="text-red-500">*</span></label>
              <select name="courseId" value={form.courseId} onChange={handleChange} disabled={!form.affiliation} className={inputClass("courseId")}>
                <option value="">{loadingCourses ? "Loading..." : "Select Course"}</option>
                {courses.map((c) => <option key={c.courseId} value={c.courseId}>{c.courseName}</option>)}
              </select>
              {errors.courseId && <p className="text-xs text-red-600 mt-1 flex items-center gap-1">{errors.courseId}</p>}
            </div>
        </div>

        {/* Row 2: Syllabus (Subject) & Set Name */}
        <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject (Syllabus) <span className="text-red-500">*</span></label>
              <select name="syllabusId" value={form.syllabusId} onChange={handleChange} disabled={!form.courseId} className={inputClass("syllabusId")}>
                 <option value="">{loadingSyllabi ? "Loading..." : "Select Subject"}</option>
                 {syllabi.map((s) => (
                    <option key={s.syllabusId} value={s.syllabusId}>
                       {s.subjectName || s.syllabusTitle} {s.semester ? `- Sem ${s.semester}` : ''}
                    </option>
                 ))}
              </select>
              {errors.syllabusId && <p className="text-xs text-red-600 mt-1 flex items-center gap-1">{errors.syllabusId}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Set Name <span className="text-red-500">*</span></label>
              <input type="text" name="setName" value={form.setName} onChange={handleChange} placeholder="e.g. Set A 2024" className={inputClass("setName")} />
              {errors.setName && <p className="text-xs text-red-600 mt-1 flex items-center gap-1">{errors.setName}</p>}
            </div>
        </div>

        {/* Row 3: Year & File */}
        <div className="grid gap-6 md:grid-cols-2">
             <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Year <span className="text-red-500">*</span></label>
              <input type="number" name="year" value={form.year} onChange={handleChange} placeholder="YYYY" className={inputClass("year")} />
              {errors.year && <p className="text-xs text-red-600 mt-1 flex items-center gap-1">{errors.year}</p>}
            </div>
            
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">PDF Document {mode === "add" && <span className="text-red-500">*</span>}</label>
                <div className={`relative flex items-center justify-center w-full rounded-xl border-2 border-dashed transition-all ${errors.file ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
                    <label className="flex flex-col items-center justify-center w-full h-14 cursor-pointer">
                        <div className="flex items-center gap-2 text-gray-500">
                           <Upload size={20} />
                           <span className="text-sm font-medium">{form.file ? form.file.name : "Click to upload PDF"}</span>
                        </div>
                        <input type="file" name="file" onChange={handleChange} accept=".pdf" className="hidden" />
                    </label>
                </div>
                {mode === "edit" && form.existingPdfPath && <p className="text-xs text-gray-500 mt-1">Current: {form.existingPdfPath.split('/').pop()}</p>}
                {errors.file && <p className="text-xs text-red-600 mt-1 flex items-center gap-1">{errors.file}</p>}
            </div>
        </div>

        {/* Description */}
        <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea name="description" rows="3" value={form.description} onChange={handleChange} className={inputClass("description")} placeholder="Optional details..." />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={() => navigate("/old-questions/all")}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={status.loading}
              className="flex-1 px-6 py-2.5 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-700 focus:ring-4 focus:ring-violet-100 transition-all shadow-lg shadow-violet-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {status.loading ? "Saving..." : mode === "add" ? "Create Collection" : "Save Changes"}
            </button>
        </div>
      </form>
      </div>
      </div>
    </div>
  );
};
export default OldQuestionForm;
