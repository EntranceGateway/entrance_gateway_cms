import { useState, useEffect } from 'react';
import QuizLayout from '../components/QuizLayout';
import QuizModal from '../components/QuizModal';
import QuizDataTable from '../components/QuizDataTable';
import quizApi from '../services/quizApi';

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
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('question');
  const [sortDir, setSortDir] = useState('asc');

  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await quizApi.getQuestions(currentPage, pageSize, sortBy, sortDir);
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
        quizApi.getQuestionSets(0, 100).catch(e => { console.error('QuestionSets error:', e); return { data: { data: { content: [] } } }; }),
        quizApi.getCategories(0, 100).catch(e => { console.error('Categories error:', e); return { data: { data: { content: [] } } }; })
      ]);
      console.log('QuestionSets loaded:', questionSetsRes.data.data?.content);
      console.log('Categories loaded:', categoriesRes.data.data?.content);
      setQuestionSets(questionSetsRes.data.data?.content || []);
      setCategories(categoriesRes.data.data?.content || []);
      setDropdownsLoaded(true);
    } catch (error) {
      console.error('Error loading dropdown data:', error);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [currentPage, pageSize, sortBy, sortDir]);

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
    // Convert existing options to new format
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
    
    // Validate required fields
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
      
      // Append main question fields
      formDataToSend.append('question', formData.question);
      formDataToSend.append('correctAnswerIndex', parseInt(formData.correctAnswerIndex));
      formDataToSend.append('marks', parseInt(formData.marks));
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('questionSetId', formData.questionSetId);
      
      // Append question image if exists
      if (formData.questionImage) {
        formDataToSend.append('imageFile', formData.questionImage);
      }
      
      // Add options in order (only filled ones)
      let optionIndex = 0;
      formData.options.forEach((opt, idx) => {
        if (opt.text.trim()) {
          formDataToSend.append(`options[${optionIndex}].optionText`, opt.text.trim());
          formDataToSend.append(`options[${optionIndex}].optionOrder`, idx);
          optionIndex++;
        }
      });
      
      // Add option images in the SAME order as a separate array
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

  const columns = [
    { 
      key: 'question', 
      label: 'Question',
      render: (val) => <div style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val?.replace(/"/g, '')}</div>
    },
    { 
      key: 'options', 
      label: 'Options',
      render: (options, item) => (
        <span 
          className="quiz-badge quiz-badge-info" 
          style={{ cursor: 'pointer' }}
          onClick={() => showOptions(item)}
        >
          👁️ {options?.length || 0} options
        </span>
      )
    },
    { 
      key: 'correctAnswerIndex', 
      label: 'Correct',
      render: (val, item) => {
        const correctOption = item.options?.[val];
        return correctOption ? (
          <span className="quiz-badge quiz-badge-success" title={correctOption}>Option {val + 1}</span>
        ) : '-';
      }
    },
    { 
      key: 'marks', 
      label: 'Marks',
      render: (val) => <span className="quiz-badge quiz-badge-primary">{val || 1}</span>
    },
    { 
      key: 'categoryName', 
      label: 'Category',
      render: (val) => val || '-'
    },
    { 
      key: 'questionSetTitle', 
      label: 'Question Set',
      render: (val) => val || '-'
    },
  ];

  const actions = (question) => (
    <>
      <button className="quiz-btn quiz-btn-sm quiz-btn-primary" onClick={() => handleEdit(question)}>Edit</button>
      <button className="quiz-btn quiz-btn-sm quiz-btn-danger" onClick={() => handleDelete(question.questionId || question.id)}>Delete</button>
    </>
  );

  return (
    <QuizLayout 
      title="Questions Management"
      action={<button className="quiz-btn quiz-btn-primary" onClick={handleAdd}>Add Question</button>}
    >
      <QuizDataTable
        columns={columns}
        data={questions}
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

      <QuizModal show={showModal} onClose={() => setShowModal(false)} title={editingQuestion ? 'Edit Question' : 'Add Question'}>
        <form onSubmit={handleSubmit}>
          <div className="quiz-form-group">
            <label>Question *</label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Enter the question"
              required
            />
          </div>
          
          <div className="quiz-form-group">
            <label>Question Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, questionImage: e.target.files[0] })}
              style={{ padding: '10px', border: '2px dashed #cbd5e1', borderRadius: '8px', width: '100%', cursor: 'pointer' }}
            />
            {formData.questionImage && (
              <p style={{ color: '#10b981', fontSize: '12px', marginTop: '5px' }}>✓ Selected: {formData.questionImage.name}</p>
            )}
          </div>
          
          <div className="quiz-form-group">
            <label>Option 1 *</label>
            <input
              type="text"
              value={formData.options[0].text}
              onChange={(e) => updateOption(0, 'text', e.target.value)}
              placeholder="Enter option 1"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => updateOption(0, 'image', e.target.files[0])}
              style={{ marginTop: '8px', padding: '8px', border: '1px dashed #cbd5e1', borderRadius: '6px', width: '100%', cursor: 'pointer', fontSize: '12px' }}
            />
            {formData.options[0].image && (
              <p style={{ color: '#10b981', fontSize: '11px', marginTop: '3px' }}>✓ {formData.options[0].image.name}</p>
            )}
          </div>
          <div className="quiz-form-group">
            <label>Option 2 *</label>
            <input
              type="text"
              value={formData.options[1].text}
              onChange={(e) => updateOption(1, 'text', e.target.value)}
              placeholder="Enter option 2"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => updateOption(1, 'image', e.target.files[0])}
              style={{ marginTop: '8px', padding: '8px', border: '1px dashed #cbd5e1', borderRadius: '6px', width: '100%', cursor: 'pointer', fontSize: '12px' }}
            />
            {formData.options[1].image && (
              <p style={{ color: '#10b981', fontSize: '11px', marginTop: '3px' }}>✓ {formData.options[1].image.name}</p>
            )}
          </div>
          <div className="quiz-form-group">
            <label>Option 3</label>
            <input
              type="text"
              value={formData.options[2].text}
              onChange={(e) => updateOption(2, 'text', e.target.value)}
              placeholder="Enter option 3 (optional)"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => updateOption(2, 'image', e.target.files[0])}
              style={{ marginTop: '8px', padding: '8px', border: '1px dashed #cbd5e1', borderRadius: '6px', width: '100%', cursor: 'pointer', fontSize: '12px' }}
            />
            {formData.options[2].image && (
              <p style={{ color: '#10b981', fontSize: '11px', marginTop: '3px' }}>✓ {formData.options[2].image.name}</p>
            )}
          </div>
          <div className="quiz-form-group">
            <label>Option 4</label>
            <input
              type="text"
              value={formData.options[3].text}
              onChange={(e) => updateOption(3, 'text', e.target.value)}
              placeholder="Enter option 4 (optional)"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => updateOption(3, 'image', e.target.files[0])}
              style={{ marginTop: '8px', padding: '8px', border: '1px dashed #cbd5e1', borderRadius: '6px', width: '100%', cursor: 'pointer', fontSize: '12px' }}
            />
            {formData.options[3].image && (
              <p style={{ color: '#10b981', fontSize: '11px', marginTop: '3px' }}>✓ {formData.options[3].image.name}</p>
            )}
          </div>
          
          <div className="quiz-form-group">
            <label>Correct Answer *</label>
            <select
              value={formData.correctAnswerIndex}
              onChange={(e) => setFormData({ ...formData, correctAnswerIndex: e.target.value })}
              required
            >
              <option value="0">Option 1</option>
              <option value="1">Option 2</option>
              <option value="2">Option 3</option>
              <option value="3">Option 4</option>
            </select>
          </div>

          <div className="quiz-form-group">
            <label>Marks *</label>
            <input
              type="number"
              value={formData.marks}
              onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
              min="1"
              required
            />
          </div>

          <div className="quiz-form-group">
            <label>Category *</label>
            {!dropdownsLoaded ? (
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading categories...</p>
            ) : categories.length === 0 ? (
              <p style={{ color: '#ef4444', fontSize: '14px' }}>No categories found. Please create categories first.</p>
            ) : (
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
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

          <div className="quiz-form-group">
            <label>Question Set *</label>
            {!dropdownsLoaded ? (
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading question sets...</p>
            ) : questionSets.length === 0 ? (
              <p style={{ color: '#ef4444', fontSize: '14px' }}>No question sets found. Please create question sets first.</p>
            ) : (
              <select
                value={formData.questionSetId}
                onChange={(e) => setFormData({ ...formData, questionSetId: e.target.value })}
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

          <div className="quiz-modal-actions">
            <button type="button" className="quiz-btn quiz-btn-secondary" onClick={() => setShowModal(false)} disabled={submitting}>Cancel</button>
            <button type="submit" className="quiz-btn quiz-btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </QuizModal>

      {/* Options View Modal */}
      <QuizModal show={showOptionsModal} onClose={() => setShowOptionsModal(false)} title="Question Options">
        {selectedQuestion && (
          <div>
            <div style={{ 
              padding: '15px', 
              background: '#f8fafc', 
              borderRadius: '12px', 
              marginBottom: '20px',
              borderLeft: '4px solid #6366f1'
            }}>
              <strong style={{ color: '#475569', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Question:</strong>
              <p style={{ margin: '8px 0 0', color: '#1e293b', fontSize: '15px' }}>{selectedQuestion.question?.replace(/"/g, '')}</p>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <strong style={{ color: '#475569', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Options:</strong>
            </div>
            
            {selectedQuestion.options?.map((option, index) => (
              <div 
                key={index}
                style={{ 
                  padding: '12px 16px',
                  marginBottom: '10px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: index === selectedQuestion.correctAnswerIndex 
                    ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' 
                    : '#f1f5f9',
                  border: index === selectedQuestion.correctAnswerIndex 
                    ? '2px solid #10b981' 
                    : '1px solid #e2e8f0'
                }}
              >
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '700',
                  background: index === selectedQuestion.correctAnswerIndex ? '#10b981' : '#cbd5e1',
                  color: 'white'
                }}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span style={{ 
                  flex: 1,
                  color: index === selectedQuestion.correctAnswerIndex ? '#047857' : '#334155',
                  fontWeight: index === selectedQuestion.correctAnswerIndex ? '600' : '400'
                }}>
                  {option}
                </span>
                {index === selectedQuestion.correctAnswerIndex && (
                  <span style={{ color: '#10b981', fontSize: '18px' }}>✓</span>
                )}
              </div>
            ))}
            
            <div style={{ 
              marginTop: '20px', 
              padding: '12px', 
              background: '#faf5ff', 
              borderRadius: '10px',
              display: 'flex',
              gap: '20px'
            }}>
              <div>
                <span style={{ color: '#94a3b8', fontSize: '12px' }}>Marks:</span>
                <strong style={{ marginLeft: '6px', color: '#6366f1' }}>{selectedQuestion.marks || 1}</strong>
              </div>
              <div>
                <span style={{ color: '#94a3b8', fontSize: '12px' }}>Category:</span>
                <strong style={{ marginLeft: '6px', color: '#6366f1' }}>{selectedQuestion.categoryName || '-'}</strong>
              </div>
            </div>
          </div>
        )}
        <div className="quiz-modal-actions">
          <button className="quiz-btn quiz-btn-secondary" onClick={() => setShowOptionsModal(false)}>Close</button>
        </div>
      </QuizModal>
    </QuizLayout>
  );
};

export default QuizQuestions;
