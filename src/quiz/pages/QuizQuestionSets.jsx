import { useState, useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import { Plus, Edit, Trash2, FileText, Clock, DollarSign } from 'lucide-react';
import quizApi from '../services/quizApi';
import Pagination from '../../Verification/Pagination';

const QuizQuestionSets = () => {
  const [questionSets, setQuestionSets] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSet, setEditingSet] = useState(null);
  const [formData, setFormData] = useState({ setName: '', description: '', nosOfQuestions: '', durationInMinutes: '', price: '', courseId: '' });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  const loadCourses = async () => {
    try {
      const response = await quizApi.getCourses(0, 1000, 'courseName', 'asc');
      setCourses(response.data.data.content || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const loadQuestionSets = async () => {
    try {
      setLoading(true);
      const response = await quizApi.getQuestionSets(currentPage, pageSize, 'setName', 'asc');
      setQuestionSets(response.data.data.content || []);
      setTotalPages(response.data.data.totalPages || 1);
    } catch (error) {
      console.error('Error loading question sets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
    loadQuestionSets();
  }, [currentPage, pageSize]);

  const handleAdd = () => {
    setEditingSet(null);
    setFormData({ setName: '', description: '', nosOfQuestions: '', durationInMinutes: '', price: '', courseId: '' });
    setShowModal(true);
  };

  const handleEdit = (set) => {
    setEditingSet(set);
    setFormData({ 
      setName: set.setName, 
      description: set.description || '',
      nosOfQuestions: set.nosOfQuestions || '',
      durationInMinutes: set.durationInMinutes || '',
      price: set.price || '',
      courseId: set.courseId || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (questionSetId) => {
    if (!confirm('Are you sure you want to delete this question set?')) return;
    
    try {
      await quizApi.deleteQuestionSet(questionSetId);
      loadQuestionSets();
    } catch (error) {
      alert('Error deleting question set');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingSet) {
        await quizApi.updateQuestionSet(editingSet.questionSetId || editingSet.id, formData);
      } else {
        await quizApi.createQuestionSet(formData);
      }
      setShowModal(false);
      loadQuestionSets();
    } catch (error) {
      alert('Error saving question set');
    }
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FileText size={24} className="text-indigo-600" />
          Question Sets Management
        </h1>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          Add Question Set
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left font-medium text-gray-700">Name</th>
                <th className="p-4 text-left font-medium text-gray-700">Course</th>
                <th className="p-4 text-left font-medium text-gray-700">Questions</th>
                <th className="p-4 text-left font-medium text-gray-700">Duration</th>
                <th className="p-4 text-left font-medium text-gray-700">Price</th>
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
              ) : questionSets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No question sets found.
                  </td>
                </tr>
              ) : (
                questionSets.map((set) => (
                  <tr key={set.questionSetId || set.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{set.setName}</td>
                    <td className="p-4 text-gray-600">{set.courseName || '-'}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                        {set.nosOfQuestions || 0}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 flex items-center gap-1">
                      <Clock size={14} />
                      {set.durationInMinutes || 0} min
                    </td>
                    <td className="p-4 text-gray-600">
                      Rs. {Number(set.price || 0).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(set)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(set.questionSetId || set.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingSet ? 'Edit Question Set' : 'Add Question Set'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.setName}
                  onChange={(e) => setFormData({ ...formData, setName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  minLength={3}
                  maxLength={100}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  maxLength={500}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                <select
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course.courseId} value={course.courseId}>
                      {course.courseName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Questions *</label>
                  <input
                    type="number"
                    value={formData.nosOfQuestions}
                    onChange={(e) => setFormData({ ...formData, nosOfQuestions: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    min={1}
                    max={500}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min) *</label>
                  <input
                    type="number"
                    value={formData.durationInMinutes}
                    onChange={(e) => setFormData({ ...formData, durationInMinutes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    min={1}
                    max={600}
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  min={0}
                  max={99999.99}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default QuizQuestionSets;
