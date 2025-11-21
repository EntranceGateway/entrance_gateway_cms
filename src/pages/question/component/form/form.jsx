import { useState } from "react";
import { Plus, CheckCircle, AlertCircle } from "lucide-react"; // Optional: for icons

const AdminQuestionForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    marks: 1,
    categoryId: "",
    questionSetId: "",
    free: true,
  });

  const [errors, setErrors] = useState({});

  const handleOptionChange = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm((prev) => ({ ...prev, options: newOptions }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.question.trim()) newErrors.question = "Question is required";
    if (form.options.some((opt) => !opt.trim()))
      newErrors.options = "All options are required";
    if (!form.correctAnswer.trim())
      newErrors.correctAnswer = "Correct answer is required";
    if (!form.categoryId.trim()) newErrors.categoryId = "Category ID is required";
    if (!form.questionSetId.trim())
      newErrors.questionSetId = "Question Set ID is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      question: form.question.trim(),
      option1: form.options[0],
      option2: form.options[1],
      option3: form.options[2],
      option4: form.options[3],
      correctAnswer: form.correctAnswer.trim(),
      marks: Number(form.marks),
      categoryId: form.categoryId,
      questionSetId: form.questionSetId,
      free: form.free,
    };

    onSubmit?.(payload);
    console.log("Submitted:", payload);

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
            </div>

            {/* Options */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                Answer Options
              </label>
              <div className="grid md:grid-cols-2 gap-5">
                {form.options.map((opt, idx) => (
                  <div key={idx} className="relative">
                    <div className="flex items-center gap-3">
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
                        value={opt}
                        onChange={(e) =>
                          handleOptionChange(idx, e.target.value)
                        }
                        className={`flex-1 px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none ${
                          errors.options ? "border-red-400" : "border-gray-200"
                        }`}
                        placeholder={`Option ${idx + 1}`}
                        required
                      />
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
              <input
                type="text"
                value={form.correctAnswer}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    correctAnswer: e.target.value,
                  }))
                }
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 outline-none ${
                  errors.correctAnswer ? "border-red-400" : "border-gray-200"
                }`}
                placeholder="Type the exact correct answer (case-sensitive)"
                required
              />
              {errors.correctAnswer && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle size={16} /> {errors.correctAnswer}
                </p>
              )}
            </div>

            {/* Marks & Free */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  Marks
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.marks}
                  onChange={(e) =>
                    setForm({ ...form, marks: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none"
                  required
                />
              </div>

              <div className="md:col-span-2 flex items-end">
                <label className="flex items-center gap-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.free}
                    onChange={(e) =>
                      setForm({ ...form, free: e.target.checked })
                    }
                    className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-lg font-medium text-gray-700">
                    Free Question (Visible to all users)
                  </span>
                </label>
              </div>
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