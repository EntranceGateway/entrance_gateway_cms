import { useState, useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import { Trophy, Eye, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import quizApi from '../services/quizApi';
import Pagination from '../../Verification/Pagination';

const QuizResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  const loadResults = async () => {
    try {
      setLoading(true);
      const response = await quizApi.getQuizResults(currentPage, pageSize, 'attemptedAt', 'desc');
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
  }, [currentPage, pageSize]);

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
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getChangeIcon = (current, previous) => {
    const diff = current - (previous || 0);
    if (diff > 0) return <TrendingUp size={14} className="text-emerald-500" />;
    if (diff < 0) return <TrendingDown size={14} className="text-red-500" />;
    return <Minus size={14} className="text-gray-400" />;
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Trophy size={24} className="text-indigo-600" />
          Quiz Results
        </h1>
        <p className="text-gray-500 mt-1">View and analyze quiz attempt results</p>
      </div>

      {/* Table */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left font-medium text-gray-700">Question Set</th>
                <th className="p-4 text-left font-medium text-gray-700">Total Score</th>
                <th className="p-4 text-left font-medium text-gray-700">Previous Score</th>
                <th className="p-4 text-left font-medium text-gray-700">Current Rank</th>
                <th className="p-4 text-left font-medium text-gray-700">Attempted At</th>
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
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No results found.
                  </td>
                </tr>
              ) : (
                results.map((result) => (
                  <tr key={result.resultId || result.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{result.questionSet?.name || '-'}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                        {result.totalScore}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          {result.previousScore || 0}
                        </span>
                        {getChangeIcon(result.totalScore, result.previousScore)}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">
                        #{result.currentRank || '-'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{formatDate(result.attemptedAt)}</td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleViewDetails(result)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1"
                        title="View Details"
                      >
                        <Eye size={18} />
                        <span className="text-sm">Details</span>
                      </button>
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

      {/* Details Modal */}
      {showModal && selectedResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Trophy size={20} className="text-indigo-600" />
              Quiz Result Details
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 font-medium mb-1">Question Set</p>
                <p className="text-gray-800 font-medium">{selectedResult.questionSet?.name || '-'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <p className="text-sm text-indigo-600 font-medium mb-1">Total Score</p>
                  <p className="text-2xl font-bold text-indigo-700">{selectedResult.totalScore}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 font-medium mb-1">Previous Score</p>
                  <p className="text-2xl font-bold text-gray-600">{selectedResult.previousScore || 0}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-cyan-50 rounded-lg">
                  <p className="text-sm text-cyan-600 font-medium mb-1">Current Rank</p>
                  <p className="text-2xl font-bold text-cyan-700">#{selectedResult.currentRank || '-'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 font-medium mb-1">Previous Rank</p>
                  <p className="text-2xl font-bold text-gray-600">#{selectedResult.previousRank || '-'}</p>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600 font-medium mb-1">Score Change</p>
                <p className={`text-xl font-bold ${
                  selectedResult.totalScore - (selectedResult.previousScore || 0) > 0 ? 'text-emerald-600' :
                  selectedResult.totalScore - (selectedResult.previousScore || 0) < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {selectedResult.totalScore - (selectedResult.previousScore || 0) > 0 ? '+' : ''}
                  {selectedResult.totalScore - (selectedResult.previousScore || 0)}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 font-medium mb-1">Attempted At</p>
                <p className="text-gray-800">{formatDateTime(selectedResult.attemptedAt)}</p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button 
                onClick={() => setShowModal(false)}
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

export default QuizResults;
