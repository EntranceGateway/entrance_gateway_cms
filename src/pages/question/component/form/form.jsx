import { useState } from "react";
import { Plus, CheckCircle, AlertCircle } from "lucide-react"; // Optional: for icons

const AdminQuestionForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    question: "",
    questionImage: null,
    options: [
      { text: "", image: null },
      { text: "", image: null },
      { text: "", image: null },
      { text: "", image: null }
    ],
    correctAnswerIndex: null,
    marks: 1,
    categoryId: "",
    questionSetId: "",
  });

  const [errors, setErrors] = useState({});

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...form.options];
    newOptions[index][field] = value;
    setForm((prev) => ({ ...prev, options: newOptions }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.question.trim()) newErrors.question = "Question is required";
    if (form.options.filter(opt => opt.text.trim()).length < 2) newErrors.options = "At least 2 options are required";
    if (form.correctAnswerIndex === null || form.correctAnswerIndex === "") newErrors.correctAnswerIndex = "Correct answer index is required";
    if (!form.categoryId.trim()) newErrors.categoryId = "Category ID is required";
    if (!form.questionSetId.trim()) newErrors.questionSetId = "Question Set ID is required";
    if (form.marks < 0) newErrors.marks = "Marks must be non-negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    
    // Append main question fields
    formData.append('question', form.question.trim());
    formData.append('correctAnswerIndex', form.correctAnswerIndex);
    formData.append('marks', form.marks);
    formData.append('categoryId', form.categoryId);
    formData.append('questionSetId', form.questionSetId);
    
    // Append question image if exists
    if (form.questionImage) {
      formData.append('imageFile', form.questionImage);
    }
    
    // Append options with their texts, order, and images
    // McqOptionRequest has: optionText, optionOrder, optionImageName (MultipartFile)
    form.options.forEach((opt, idx) => {
      if (opt.text.trim()) {
        formData.append(`options[${idx}].optionText`, opt.text.trim());
        formData.append(`options[${idx}].optionOrder`, idx);
        if (opt.image) {
          // Option image is part of McqOptionRequest as optionImageName
          formData.append(`options[${idx}].optionImageName`, opt.image);
        }
      }
    });

    onSubmit?.(formData);

    // Optional: Show success feedback
    alert("Question submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Add New Question
          </h1>
          <p className="text-gray-600">Create a high-quality quiz question</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="p-8 space-y-8">
            {/* Question */}
            <div>
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                <span className="text-blue-600">Q.</span> Question
              </label>
              <textarea
                rows={3}
                value={form.question}
                onChange={(e) =>
                  setForm({ ...form, question: e.target.value })
                }
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none resize-none ${
                  errors.question ? "border-red-400" : "border-gray-200"
                }`}
                placeholder="Enter your question here..."
                required
              />
              {errors.question && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={16} /> {errors.question}
                </p>
              )}
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📷 Question Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, questionImage: e.target.files[0] })
                  }
                  className="w-full px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition-all duration-200"
                />
                {form.questionImage && (
                  <p className="mt-2 text-sm text-green-600">✓ Selected: {form.questionImage.name}</p>
                )}
              </div>
            </div>

            {/* Options */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Answer Options
              </label>
              <div className="space-y-4">
                {form.options.map((opt, idx) => (
                  <div key={idx} className="relative">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md ${
                          idx === 0
                            ? "bg-green-500"
                            : idx === 1
                            ? "bg-blue-500"
                            : idx === 2
                            ? "bg-orange-500"
                            : "bg-purple-500"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) =>
                          handleOptionChange(idx, 'text', e.target.value)
                        }
                        className={`flex-1 px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none ${
                          errors.options ? "border-red-400" : "border-gray-200"
                        }`}
                        placeholder={`Option ${idx + 1}`}
                      />
                    </div>
                    <div className="ml-[52px] mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        📷 Option Image (optional)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleOptionChange(idx, 'image', e.target.files[0])
                        }
                        className="w-full px-3 py-2 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-all duration-200 text-sm"
                      />
                      {opt.image && (
                        <p className="mt-1 text-xs text-green-600">✓ {opt.image.name}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {errors.options && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={16} /> {errors.options}
                </p>
              )}
            </div>

            {/* Correct Answer */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                <span className="text-green-600 flex items-center gap-2">
                  <CheckCircle size={20} /> Correct Answer
                </span>
              </label>
              <select
                value={form.correctAnswerIndex ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    correctAnswerIndex: e.target.value ? parseInt(e.target.value) : null,
                  }))
                }
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 outline-none ${
                  errors.correctAnswerIndex ? "border-red-400" : "border-gray-200"
                }`}
                required
              >
                <option value="">Select correct answer</option>
                {form.options.map((opt, idx) => (
                  <option key={idx} value={idx} disabled={!opt.text.trim()}>
                    {String.fromCharCode(65 + idx)} - {opt.text || `Option ${idx + 1}`}
                  </option>
                ))}
              </select>
              {errors.correctAnswerIndex && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={16} /> {errors.correctAnswerIndex}
                </p>
              )}
            </div>

            {/* Marks */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Marks
              </label>
              <input
                type="number"
                min="0"
                value={form.marks}
                onChange={(e) =>
                  setForm({ ...form, marks: parseInt(e.target.value) || 0 })
                }
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none ${
                  errors.marks ? "border-red-400" : "border-gray-200"
                }`}
                required
              />
              {errors.marks && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={16} /> {errors.marks}
                </p>
              )}
            </div>

            {/* IDs */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Category ID
                </label>
                <input
                  type="text"
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none ${
                    errors.categoryId ? "border-red-400" : "border-gray-200"
                  }`}
                  placeholder="e.g., science-101"
                  required
                />
                {errors.categoryId && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.categoryId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Question Set ID
                </label>
                <input
                  type="text"
                  value={form.questionSetId}
                  onChange={(e) =>
                    setForm({ ...form, questionSetId: e.target.value })
                  }
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none ${
                    errors.questionSetId ? "border-red-400" : "border-gray-200"
                  }`}
                  placeholder="e.g., mock-test-2025"
                  required
                />
                {errors.questionSetId && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.questionSetId}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold text-lg py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-3"
              >
                <Plus size={24} />
                Submit Question
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminQuestionForm;