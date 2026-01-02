import { useState, useEffect } from 'react';
import QuizLayout from '../components/QuizLayout';
import QuizModal from '../components/QuizModal';
import QuizDataTable from '../components/QuizDataTable';
import quizApi from '../services/quizApi';

const QuizQuestionSets = () => {
  const [questionSets, setQuestionSets] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSet, setEditingSet] = useState(null);
  const [formData, setFormData] = useState({ setName: '', description: '', nosOfQuestions: '', durationInMinutes: '', price: '', courseId: '' });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('setName');
  const [sortDir, setSortDir] = useState('asc');

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
      const response = await quizApi.getQuestionSets(currentPage, pageSize, sortBy, sortDir);
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
  }, [currentPage, pageSize, sortBy, sortDir]);

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

  const columns = [
    { key: 'setName', label: 'Name' },
    { key: 'courseName', label: 'Course' },
    { key: 'description', label: 'Description' },
    { key: 'nosOfQuestions', label: 'Questions' },
    { key: 'durationInMinutes', label: 'Duration (min)' },
    { 
      key: 'price', 
      label: 'Price',
      render: (val) => val !== null && val !== undefined ? `Rs. ${Number(val).toFixed(2)}` : '-'
    },
  ];

  const actions = (set) => (
    <>
      <button className="quiz-btn quiz-btn-sm quiz-btn-primary" onClick={() => handleEdit(set)}>Edit</button>
      <button className="quiz-btn quiz-btn-sm quiz-btn-danger" onClick={() => handleDelete(set.questionSetId || set.id)}>Delete</button>
    </>
  );

  return (
    <QuizLayout 
      title="Question Sets Management"
      action={<button className="quiz-btn quiz-btn-primary" onClick={handleAdd}>Add Question Set</button>}
    >
      <QuizDataTable
        columns={columns}
        data={questionSets}
        actions={actions}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        sortBy={sortBy}
        sortDir={sortDir}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onSortChange={(field, dir) => { setSortBy(field); setSortDir(dir); }}
      />

      <QuizModal show={showModal} onClose={() => setShowModal(false)} title={editingSet ? 'Edit Question Set' : 'Add Question Set'}>
        <form onSubmit={handleSubmit}>
          <div className="quiz-form-group">
            <label>Name *</label>
            <input
              type="text"
              value={formData.setName}
              onChange={(e) => setFormData({ ...formData, setName: e.target.value })}
              required
              minLength={3}
              maxLength={100}
            />
          </div>
          <div className="quiz-form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              maxLength={500}
            />
          </div>
          <div className="quiz-form-group">
            <label>Course *</label>
            <select
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
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
          <div className="quiz-form-group">
            <label>Number of Questions *</label>
            <input
              type="number"
              value={formData.nosOfQuestions}
              onChange={(e) => setFormData({ ...formData, nosOfQuestions: e.target.value })}
              required
              min={1}
              max={500}
            />
          </div>
          <div className="quiz-form-group">
            <label>Duration (minutes) *</label>
            <input
              type="number"
              value={formData.durationInMinutes}
              onChange={(e) => setFormData({ ...formData, durationInMinutes: e.target.value })}
              required
              min={1}
              max={600}
            />
          </div>
          <div className="quiz-form-group">
            <label>Price *</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              min={0}
              max={99999.99}
            />
          </div>
          <div className="quiz-modal-actions">
            <button type="button" className="quiz-btn quiz-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="quiz-btn quiz-btn-primary">Save</button>
          </div>
        </form>
      </QuizModal>
    </QuizLayout>
  );
};

export default QuizQuestionSets;
