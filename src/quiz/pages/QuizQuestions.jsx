import { useState, useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import { Plus, Edit, Trash2, HelpCircle, Eye, CheckCircle } from 'lucide-react';
import quizApi from '../services/quizApi';
import Pagination from '../../Verification/Pagination';

const QuizQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [questionSets, setQuestionSets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dropdownsLoaded, setDropdownsLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    questionImage: null,
    options: [
      { text: '', image: null },
      { text: '', image: null },
      { text: '', image: null },
      { text: '', image: null }
    ],
    correctAnswerIndex: 0,
    marks: 1,
    categoryId: '',
    questionSetId: ''
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await quizApi.getQuestions(currentPage, pageSize, 'question', 'asc');
      const data = response.data.data;
      setQuestions(data.content || []);
      setTotalPages(data.page?.totalPages || 1);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDropdownData = async () => {
    try {
      const [questionSetsRes, categoriesRes] = await Promise.all([
        quizApi.getQuestionSets(0, 100).catch(() => ({ data: { data: { content: [] } } })),
        quizApi.getCategories(0, 100).catch(() => ({ data: { data: { content: [] } } }))
      ]);
      setQuestionSets(questionSetsRes.data.data?.content || []);
      setCategories(categoriesRes.data.data?.content || []);
      setDropdownsLoaded(true);
    } catch (error) {
      console.error('Error loading dropdown data:', error);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [currentPage, pageSize]);

  useEffect(() => {
    loadDropdownData();
  }, []);

  const handleAdd = () => {
    setEditingQuestion(null);
    setFormData({ 
      question: '', 
      questionImage: null,
      options: [
        { text: '', image: null },
        { text: '', image: null },
        { text: '', image: null },
        { text: '', image: null }
      ],
      correctAnswerIndex: 0,
      marks: 1,
      categoryId: '',
      questionSetId: ''
    });
    setShowModal(true);
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    const existingOptions = question.options || [];
    const formattedOptions = [
      { text: existingOptions[0]?.optionText || existingOptions[0] || '', image: null },
      { text: existingOptions[1]?.optionText || existingOptions[1] || '', image: null },
      { text: existingOptions[2]?.optionText || existingOptions[2] || '', image: null },
      { text: existingOptions[3]?.optionText || existingOptions[3] || '', image: null }
    ];
    setFormData({
      question: question.question || '',
      questionImage: null,
      options: formattedOptions,
      correctAnswerIndex: question.correctAnswerIndex || 0,
      marks: question.marks || 1,
      categoryId: question.categoryId || '',
      questionSetId: question.questionSetId || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (questionId) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    try {
      await quizApi.deleteQuestion(questionId);
      loadQuestions();
    } catch (error) {
      alert('Error deleting question');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    
    const filledOptions = formData.options.filter(opt => opt.text.trim());
    if (filledOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }
    if (!formData.categoryId) {
      alert('Please select a category');
      return;
    }
    if (!formData.questionSetId) {
      alert('Please select a question set');
      return;
    }
    
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('question', formData.question);
      formDataToSend.append('correctAnswerIndex', parseInt(formData.correctAnswerIndex));
      formDataToSend.append('marks', parseInt(formData.marks));
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('questionSetId', formData.questionSetId);
      
      if (formData.questionImage) {
        formDataToSend.append('imageFile', formData.questionImage);
      }
      
      let optionIndex = 0;
      formData.options.forEach((opt, idx) => {
        if (opt.text.trim()) {
          formDataToSend.append(`options[${optionIndex}].optionText`, opt.text.trim());
          formDataToSend.append(`options[${optionIndex}].optionOrder`, idx);
          optionIndex++;
        }
      });
      
      formData.options.forEach((opt) => {
        if (opt.text.trim() && opt.image) {
          formDataToSend.append('optionImageFiles', opt.image);
        }
      });

      if (editingQuestion) {
        await quizApi.updateQuestion(editingQuestion.questionId, formDataToSend);
      } else {
        await quizApi.createQuestion(formDataToSend);
      }
      setShowModal(false);
      loadQuestions();
    } catch (error) {
      alert('Error saving question: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData({ ...formData, options: newOptions });
  };

  const showOptions = (question) => {
    setSelectedQuestion(question);
    setShowOptionsModal(true);
  };

  const truncate = (text, maxLength = 50) => {
    if (!text) return '-';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <HelpCircle size={24} className="text-indigo-600" />
          Questions Management
        </h1>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          Add Question
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left font-medium text-gray-700">Question</th>
                <th className="p-4 text-left font-medium text-gray-700">Options</th>
                <th className="p-4 text-left font-medium text-gray-700">Correct</th>
                <th className="p-4 text-left font-medium text-gray-700">Marks</th>
                <th className="p-4 text-left font-medium text-gray-700">Category</th>
                <th className="p-4 text-left font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <span className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></span>
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : questions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No questions found.
                  </td>
                </tr>
              ) : (
                questions.map((question) => (
                  <tr key={question.questionId || question.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900 max-w-xs">
                      {truncate(question.question?.replace(/"/g, ''), 40)}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => showOptions(question)}
                        className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium flex items-center gap-1 hover:bg-cyan-200"
                      >
                        <Eye size={12} />
                        {question.options?.length || 0} options
                      </button>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                        Option {(question.correctAnswerIndex || 0) + 1}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                        {question.marks || 1}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{question.categoryName || '-'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(question)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(question.questionId || question.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t">
            <Pagination
              page={currentPage + 1}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page - 1)}
            />
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingQuestion ? 'Edit Question' : 'Add Question'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Question *</label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, questionImage: e.target.files[0] })}
                  className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg"
                />
              </div>

              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Option {idx + 1} {idx < 2 && '*'}
                  </label>
                  <input
                    type="text"
                    value={formData.options[idx].text}
                    onChange={(e) => updateOption(idx, 'text', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required={idx < 2}
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer *</label>
                  <select
                    value={formData.correctAnswerIndex}
                    onChange={(e) => setFormData({ ...formData, correctAnswerIndex: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="0">Option 1</option>
                    <option value="1">Option 2</option>
                    <option value="2">Option 3</option>
                    <option value="3">Option 4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marks *</label>
                  <input
                    type="number"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    min={1}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                {!dropdownsLoaded ? (
                  <p className="text-gray-400 text-sm">Loading...</p>
                ) : (
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Set *</label>
                {!dropdownsLoaded ? (
                  <p className="text-gray-400 text-sm">Loading...</p>
                ) : (
                  <select
                    value={formData.questionSetId}
                    onChange={(e) => setFormData({ ...formData, questionSetId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Question Set</option>
                    {questionSets.map((qs) => (
                      <option key={qs.questionSetId} value={qs.questionSetId}>
                        {qs.setName}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Options View Modal */}
      {showOptionsModal && selectedQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowOptionsModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Question Options</h2>
            
            <div className="p-4 bg-gray-50 rounded-lg mb-4 border-l-4 border-indigo-600">
              <p className="text-sm text-gray-500 font-medium uppercase mb-1">Question:</p>
              <p className="text-gray-800">{selectedQuestion.question?.replace(/"/g, '')}</p>
            </div>
            
            <div className="space-y-2 mb-4">
              {selectedQuestion.options?.map((option, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg flex items-center gap-3 ${
                    index === selectedQuestion.correctAnswerIndex 
                      ? 'bg-emerald-100 border-2 border-emerald-500' 
                      : 'bg-gray-100 border border-gray-200'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === selectedQuestion.correctAnswerIndex ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className={index === selectedQuestion.correctAnswerIndex ? 'font-medium text-emerald-700' : 'text-gray-700'}>
                    {option}
                  </span>
                  {index === selectedQuestion.correctAnswerIndex && (
                    <CheckCircle size={18} className="text-emerald-500 ml-auto" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setShowOptionsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default QuizQuestions;
