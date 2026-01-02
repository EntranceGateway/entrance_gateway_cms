import { useState, useEffect } from 'react';
import QuizLayout from '../components/QuizLayout';
import QuizModal from '../components/QuizModal';
import QuizDataTable from '../components/QuizDataTable';
import quizApi from '../services/quizApi';

const QuizCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ categoryName: '', remarks: '' });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('categoryName');
  const [sortDir, setSortDir] = useState('asc');

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await quizApi.getCategories(currentPage, pageSize, sortBy, sortDir);
      setCategories(response.data.data.content || []);
      setTotalPages(response.data.data.totalPages || 1);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [currentPage, pageSize, sortBy, sortDir]);

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ categoryName: '', remarks: '' });
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ categoryName: category.categoryName, remarks: category.remarks || '' });
    setShowModal(true);
  };

  const handleDelete = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await quizApi.deleteCategory(categoryId);
      loadCategories();
    } catch (error) {
      alert('Error deleting category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        await quizApi.updateCategory(editingCategory.categoryId, formData);
      } else {
        await quizApi.createCategory(formData);
      }
      setShowModal(false);
      loadCategories();
    } catch (error) {
      alert('Error saving category');
    }
  };

  const columns = [
    { key: 'categoryName', label: 'Name' },
    { key: 'remarks', label: 'Remarks' },
  ];

  const actions = (category) => (
    <>
      <button className="quiz-btn quiz-btn-sm quiz-btn-primary" onClick={() => handleEdit(category)}>Edit</button>
      <button className="quiz-btn quiz-btn-sm quiz-btn-danger" onClick={() => handleDelete(category.categoryId)}>Delete</button>
    </>
  );

  return (
    <QuizLayout 
      title="Categories Management"
      action={<button className="quiz-btn quiz-btn-primary" onClick={handleAdd}>Add Category</button>}
    >
      <QuizDataTable
        columns={columns}
        data={categories}
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

      <QuizModal show={showModal} onClose={() => setShowModal(false)} title={editingCategory ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={handleSubmit}>
          <div className="quiz-form-group">
            <label>Category Name *</label>
            <input
              type="text"
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
              required
            />
          </div>
          <div className="quiz-form-group">
            <label>Remarks</label>
            <textarea
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
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

export default QuizCategories;
