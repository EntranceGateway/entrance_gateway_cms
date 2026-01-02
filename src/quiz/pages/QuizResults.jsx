import { useState, useEffect } from 'react';
import QuizLayout from '../components/QuizLayout';
import QuizModal from '../components/QuizModal';
import QuizDataTable from '../components/QuizDataTable';
import quizApi from '../services/quizApi';

const QuizResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('attemptedAt');
  const [sortDir, setSortDir] = useState('desc');

  const loadResults = async () => {
    try {
      setLoading(true);
      const response = await quizApi.getQuizResults(currentPage, pageSize, sortBy, sortDir);
      setResults(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
    const interval = setInterval(loadResults, 30000);
    return () => clearInterval(interval);
  }, [currentPage, pageSize, sortBy, sortDir]);

  const handleViewDetails = async (result) => {
    try {
      const response = await quizApi.getQuizResultById(result.resultId || result.id);
      setSelectedResult(response.data);
      setShowModal(true);
    } catch (error) {
      alert('Error loading result details');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const columns = [
    { 
      key: 'questionSet', 
      label: 'Question Set',
      render: (val) => val?.name || 'N/A'
    },
    { 
      key: 'totalScore', 
      label: 'Total Score',
      render: (val) => <span className="quiz-badge quiz-badge-primary">{val}</span>
    },
    { 
      key: 'previousScore', 
      label: 'Previous Score',
      render: (val) => <span className="quiz-badge quiz-badge-secondary">{val || 0}</span>
    },
    { 
      key: 'currentRank', 
      label: 'Current Rank',
      render: (val) => <span className="quiz-badge quiz-badge-info">{val || 'N/A'}</span>
    },
    { 
      key: 'previousRank', 
      label: 'Previous Rank',
      render: (val) => <span className="quiz-badge quiz-badge-info">{val || 'N/A'}</span>
    },
    { 
      key: 'attemptedAt', 
      label: 'Attempted At',
      render: (val) => formatDate(val)
    },
  ];

  const actions = (result) => (
    <button className="quiz-btn quiz-btn-sm quiz-btn-primary" onClick={() => handleViewDetails(result)}>View Details</button>
  );

  return (
    <QuizLayout title="Quiz Results">
      <QuizDataTable
        columns={columns}
        data={results}
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

      <QuizModal show={showModal} onClose={() => setShowModal(false)} title="Quiz Result Details">
        {selectedResult && (
          <div>
            <div className="quiz-form-group">
              <label>Question Set:</label>
              <p>{selectedResult.questionSet?.name || 'N/A'}</p>
            </div>
            <div className="quiz-form-group">
              <label>Total Score:</label>
              <p>{selectedResult.totalScore}</p>
            </div>
            <div className="quiz-form-group">
              <label>Previous Score:</label>
              <p>{selectedResult.previousScore || 0}</p>
            </div>
            <div className="quiz-form-group">
              <label>Current Rank:</label>
              <p>{selectedResult.currentRank || 'N/A'}</p>
            </div>
            <div className="quiz-form-group">
              <label>Previous Rank:</label>
              <p>{selectedResult.previousRank || 'N/A'}</p>
            </div>
            <div className="quiz-form-group">
              <label>Score Change:</label>
              <p className={
                selectedResult.totalScore - (selectedResult.previousScore || 0) > 0 ? 'quiz-positive' :
                selectedResult.totalScore - (selectedResult.previousScore || 0) < 0 ? 'quiz-negative' : 'quiz-neutral'
              }>
                {selectedResult.totalScore - (selectedResult.previousScore || 0) > 0 ? '+' : ''}
                {selectedResult.totalScore - (selectedResult.previousScore || 0)}
              </p>
            </div>
            <div className="quiz-form-group">
              <label>Rank Change:</label>
              <p className={
                (selectedResult.previousRank || 0) - selectedResult.currentRank > 0 ? 'quiz-positive' :
                (selectedResult.previousRank || 0) - selectedResult.currentRank < 0 ? 'quiz-negative' : 'quiz-neutral'
              }>
                {(selectedResult.previousRank || 0) - selectedResult.currentRank > 0 ? '+' : ''}
                {(selectedResult.previousRank || 0) - selectedResult.currentRank}
              </p>
            </div>
            <div className="quiz-form-group">
              <label>Attempted At:</label>
              <p>{formatDateTime(selectedResult.attemptedAt)}</p>
            </div>
            <div className="quiz-modal-actions">
              <button type="button" className="quiz-btn quiz-btn-secondary" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        )}
      </QuizModal>
    </QuizLayout>
  );
};

export default QuizResults;
