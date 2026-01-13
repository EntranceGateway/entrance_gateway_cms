import React, { useState, useMemo } from "react";
import {
  Plus, Edit, Trash2, HelpCircle, Eye, CheckCircle,
  X, Save, ImageIcon, ListChecks, Type, FileText
} from "lucide-react";
import {
  useQuizQuestions,
  useQuizCategories,
  useQuizQuestionSets,
  useCreateQuizQuestion,
  useUpdateQuizQuestion,
  useDeleteQuizQuestion
} from "@/hooks/useQuiz";
import DataTable from "@/components/common/DataTable";
import ConfirmModal from "@/components/common/ConfirmModal";
import PageHeader from "@/components/common/PageHeader";
import { TableSkeleton } from "@/components/loaders";
import Layout from "@/components/layout/Layout";

const QuizQuestions = () => {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState("question");
  const [sortOrder, setSortOrder] = useState("asc");

  // State for Add/Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    questionImage: null,
    options: [
      { text: "", image: null },
      { text: "", image: null },
      { text: "", image: null },
      { text: "", image: null }
    ],
    correctAnswerIndex: 0,
    marks: 1,
    categoryId: "",
    questionSetId: ""
  });
  const [deleteId, setDeleteId] = useState(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedQuestionForView, setSelectedQuestionForView] = useState(null);

  // Queries
  const { data, isLoading, error } = useQuizQuestions({
    page,
    size: pageSize,
    sortBy: sortField,
    sortDir: sortOrder,
  });

  const { data: categoriesData } = useQuizCategories({ page: 0, size: 500 });
  const { data: setsData } = useQuizQuestionSets({ page: 0, size: 500 });

  const categories = categoriesData?.content || [];
  const questionSets = setsData?.content || [];

  // Mutations
  const createMutation = useCreateQuizQuestion();
  const updateMutation = useUpdateQuizQuestion();
  const deleteMutation = useDeleteQuizQuestion();

  const handleAdd = () => {
    setEditingQuestion(null);
    setFormData({
      question: "",
      questionImage: null,
      options: [
        { text: "", image: null },
        { text: "", image: null },
        { text: "", image: null },
        { text: "", image: null }
      ],
      correctAnswerIndex: 0,
      marks: 1,
      categoryId: "",
      questionSetId: ""
    });
    setShowModal(true);
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    const existingOptions = question.options || [];
    const formattedOptions = [0, 1, 2, 3].map(idx => ({
      text: existingOptions[idx]?.optionText || existingOptions[idx] || "",
      image: null
    }));

    setFormData({
      question: question.question || "",
      questionImage: null,
      options: formattedOptions,
      correctAnswerIndex: String(question.correctAnswerIndex || 0),
      marks: question.marks || 1,
      categoryId: question.categoryId ? String(question.categoryId) : "",
      questionSetId: question.questionSetId ? String(question.questionSetId) : ""
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    const filledOptions = formData.options.filter(opt => opt.text.trim());
    if (filledOptions.length < 2) return alert("At least 2 options are required.");
    if (!formData.categoryId) return alert("Please select a category.");
    if (!formData.questionSetId) return alert("Please select a question set.");

    try {
      const dataToSend = new FormData();
      dataToSend.append("question", formData.question);
      dataToSend.append("correctAnswerIndex", parseInt(formData.correctAnswerIndex));
      dataToSend.append("marks", parseInt(formData.marks));
      dataToSend.append("categoryId", formData.categoryId);
      dataToSend.append("questionSetId", formData.questionSetId);

      if (formData.questionImage) {
        dataToSend.append("imageFile", formData.questionImage);
      }

      let validOptionCount = 0;
      formData.options.forEach((opt, idx) => {
        if (opt.text.trim()) {
          dataToSend.append(`options[${validOptionCount}].optionText`, opt.text.trim());
          dataToSend.append(`options[${validOptionCount}].optionOrder`, idx);
          validOptionCount++;
        }
      });

      formData.options.forEach((opt) => {
        if (opt.text.trim() && opt.image) {
          dataToSend.append("optionImageFiles", opt.image);
        }
      });

      if (editingQuestion) {
        await updateMutation.mutateAsync({
          id: editingQuestion.questionId || editingQuestion.id,
          data: dataToSend
        });
      } else {
        await createMutation.mutateAsync(dataToSend);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Submit Question Error:", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (err) {
      console.error("Delete Question Error:", err);
    }
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData({ ...formData, options: newOptions });
  };

  const showOptions = (question) => {
    setSelectedQuestionForView(question);
    setShowOptionsModal(true);
  };

  const columns = useMemo(
    () => [
      {
        key: "question",
        label: "Question Content",
        sortable: true,
        render: (row) => (
          <div className="flex flex-col max-w-xs">
            <span className="font-bold text-gray-900 line-clamp-2" title={row.question}>
              {row.question?.replace(/"/g, "") || "No content"}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{row.categoryName || "Mixed"}</span>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">• {row.setName || "Independent"}</span>
            </div>
          </div>
        )
      },
      {
        key: "options",
        label: "Structure",
        render: (row) => (
          <button
            onClick={() => showOptions(row)}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-100 hover:bg-indigo-100 transition-all"
          >
            <ListChecks size={14} />
            {row.options?.length || 0} Options
          </button>
        )
      },
      {
        key: "correctAnswerIndex",
        label: "Answer",
        render: (row) => (
          <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase tracking-wider">
            <CheckCircle size={14} />
            Option {(row.correctAnswerIndex || 0) + 1}
          </div>
        )
      },
      {
        key: "marks",
        label: "Weight",
        render: (row) => (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-black border border-gray-200">
            {row.marks || 1} PT
          </span>
        )
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleEdit(row)}
              className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-all border border-transparent hover:border-amber-100"
              title="Edit Question"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => setDeleteId(row.questionId || row.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
              title="Delete Question"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )
      }
    ],
    []
  );

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl border border-red-100 max-w-2xl mx-auto mt-10">
        <h3 className="text-xl font-bold mb-2">Failed to load questions</h3>
        <p>{error.message || "An unexpected error occurred."}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <Layout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader
          title="Question Bank"
          breadcrumbs={[{ label: "Quiz", path: "/quiz" }, { label: "Questions" }]}
          actions={[
            {
              label: "Curate New Question",
              onClick: handleAdd,
              icon: <Plus size={18} />,
              variant: "primary",
            },
          ]}
        />

        {isLoading ? (
          <TableSkeleton rows={10} columns={6} />
        ) : (
          <DataTable
            data={data?.content || []}
            columns={columns}
            loading={isLoading}
            pagination={{
              currentPage: page,
              totalPages: data?.totalPages || 0,
              totalItems: data?.totalItems || 0,
              pageSize: pageSize,
            }}
            onPageChange={setPage}
            onSort={(key, dir) => {
              setSortField(key);
              setSortOrder(dir);
            }}
          />
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden transform animate-in zoom-in-95 duration-300 max-h-[95vh] flex flex-col">
              <div className="bg-indigo-600 p-8 text-white flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10 flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    <HelpCircle size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {editingQuestion ? 'Refine Question' : 'Author Question'}
                    </h2>
                    <p className="text-indigo-100 text-sm mt-0.5 opacity-80">
                      {editingQuestion ? 'Update question and media' : 'Create new assessment item'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                >
                  <X size={28} />
                </button>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              </div>

              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar bg-gray-50/50">
                <div className="space-y-8">
                  {/* Meta Config */}
                  <div className="grid grid-cols-2 gap-6 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Classification</label>
                      <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-bold transition-all appearance-none"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Assignment Set</label>
                      <select
                        value={formData.questionSetId}
                        onChange={(e) => setFormData({ ...formData, questionSetId: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-bold transition-all appearance-none"
                        required
                      >
                        <option value="">Select Question Set</option>
                        {questionSets.map(set => <option key={set.questionSetId} value={set.questionSetId}>{set.setName}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Question Body */}
                  <div className="space-y-4">
                    <div className="relative">
                      <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-3 ml-2 flex items-center gap-2">
                        <Type size={12} />
                        Interrogative Statement
                      </label>
                      <textarea
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        className="w-full px-6 py-5 bg-white border border-gray-100 rounded-[2rem] focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none text-base font-medium transition-all shadow-sm min-h-[120px]"
                        placeholder="Enter the question text here..."
                        required
                      />
                    </div>

                    <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-dashed border-gray-200">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <ImageIcon size={20} />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Question Visual (Optional)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setFormData({ ...formData, questionImage: e.target.files[0] })}
                          className="text-xs file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Options Section */}
                  <div className="space-y-6">
                    <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                      <ListChecks size={12} />
                      Response Configurations
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[0, 1, 2, 3].map((idx) => (
                        <div key={idx} className={`group relative p-5 rounded-[2rem] border transition-all ${String(formData.correctAnswerIndex) === String(idx)
                          ? 'bg-emerald-50 border-emerald-200 ring-4 ring-emerald-500/5'
                          : 'bg-white border-gray-100 hover:border-indigo-200 shadow-sm'
                          }`}>
                          <div className="flex items-start justify-between mb-3">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${String(formData.correctAnswerIndex) === String(idx)
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-100 text-gray-400 group-hover:bg-indigo-600 group-hover:text-white'
                              } transition-all`}>
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <input
                              type="radio"
                              name="correctAnswer"
                              checked={String(formData.correctAnswerIndex) === String(idx)}
                              onChange={() => setFormData({ ...formData, correctAnswerIndex: String(idx) })}
                              className="w-5 h-5 accent-emerald-600 cursor-pointer"
                            />
                          </div>
                          <textarea
                            value={formData.options[idx].text}
                            onChange={(e) => updateOption(idx, 'text', e.target.value)}
                            className="w-full bg-transparent border-none focus:ring-0 outline-none text-sm font-semibold resize-none min-h-[60px]"
                            placeholder={`Option ${idx + 1} text...`}
                            required={idx < 2}
                          />
                          <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                            <label className="cursor-pointer p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                              <ImageIcon size={14} />
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => updateOption(idx, 'image', e.target.files[0])}
                              />
                            </label>
                            {formData.options[idx].image && (
                              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Image Attached</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Score Config */}
                  <div className="bg-indigo-900 p-6 rounded-[2.5rem] text-white flex items-center justify-between shadow-xl shadow-indigo-100">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-2xl">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Scoring Weight</p>
                        <p className="text-xs text-indigo-100 opacity-60">Points awarded for correct answer</p>
                      </div>
                    </div>
                    <input
                      type="number"
                      value={formData.marks}
                      onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                      className="w-20 px-4 py-3 bg-white/10 border-none rounded-2xl focus:ring-4 focus:ring-white/10 outline-none text-center font-black text-xl"
                      required
                      min={1}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-10 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-5 border border-gray-200 text-gray-500 rounded-3xl font-bold text-sm hover:bg-white transition-all"
                    disabled={createMutation.isLoading || updateMutation.isLoading}
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] px-6 py-5 bg-indigo-600 text-white rounded-3xl font-black text-sm hover:bg-indigo-700 shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                    disabled={createMutation.isLoading || updateMutation.isLoading}
                  >
                    {(createMutation.isLoading || updateMutation.isLoading) ? (
                      <span className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Save size={20} />
                        {editingQuestion ? 'UPDATE ASSESSMENT' : 'PUBLISH TO BANK'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Options View Modal */}
        {showOptionsModal && selectedQuestionForView && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-300">
              <div className="p-8 pb-4 flex justify-between items-center">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Question Preview</h3>
                <button onClick={() => setShowOptionsModal(false)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 pt-0 space-y-6">
                <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Interrogative</p>
                  <p className="text-gray-800 font-bold text-base leading-relaxed">
                    {selectedQuestionForView.question?.replace(/"/g, '')}
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-black text-indigo-600 uppercase tracking-widest ml-1">Response Options</p>
                  {selectedQuestionForView.options?.map((option, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-2xl flex items-center gap-4 border transition-all ${index === selectedQuestionForView.correctAnswerIndex
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-white border-gray-100'
                        }`}
                    >
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${index === selectedQuestionForView.correctAnswerIndex
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-400'
                        }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className={`text-sm font-semibold flex-1 ${index === selectedQuestionForView.correctAnswerIndex ? 'text-emerald-800' : 'text-gray-700'
                        }`}>
                        {option?.optionText || option}
                      </span>
                      {index === selectedQuestionForView.correctAnswerIndex && (
                        <CheckCircle size={18} className="text-emerald-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 pt-0">
                <button
                  onClick={() => setShowOptionsModal(false)}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
                >
                  CLOSE PREVIEW
                </button>
              </div>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={!!deleteId}
          title="Discard Assessment Item"
          message="Are you sure you want to permanently remove this question from the bank? This will affect all future instances of the associated question sets. This action is irreversible."
          confirmText="Confirm Permanent Deletion"
          loading={deleteMutation.isLoading}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      </div>
    </Layout>
  );
};

export default QuizQuestions;
