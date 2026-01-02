import { useState } from 'react';

const QuizDataTable = ({ 
  columns, 
  data, 
  actions, 
  loading, 
  currentPage, 
  totalPages, 
  pageSize, 
  sortBy, 
  sortDir,
  onPageChange,
  onPageSizeChange,
  onSortChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(item =>
    columns.some(col => 
      String(item[col.key] || '').toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <>
      <div className="quiz-table-controls">
        <div className="quiz-search-box">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="quiz-filter-controls">
          <select
            className="quiz-filter-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
        <div className="quiz-pagination-controls">
          <button 
            className="quiz-btn quiz-btn-secondary" 
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <span>Page {currentPage + 1} of {totalPages}</span>
          <button 
            className="quiz-btn quiz-btn-secondary" 
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
          >
            Next
          </button>
        </div>
      </div>

      <div className="quiz-data-table">
        <table>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key}>{col.label}</th>
              ))}
              {actions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center">
                  No data found
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => {
                // Find the ID field - could be id, categoryId, courseId, questionSetId, questionId, resultId
                const itemId = item.id || item.categoryId || item.courseId || item.questionSetId || item.questionId || item.resultId || index;
                return (
                  <tr key={itemId}>
                    {columns.map(col => (
                      <td key={col.key}>
                        {col.render ? col.render(item[col.key], item) : (item[col.key] || '-')}
                      </td>
                    ))}
                    {actions && <td>{actions(item)}</td>}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default QuizDataTable;
