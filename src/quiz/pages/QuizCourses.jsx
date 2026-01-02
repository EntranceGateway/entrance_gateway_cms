import { useState, useEffect } from 'react';
import QuizLayout from '../components/QuizLayout';
import QuizDataTable from '../components/QuizDataTable';
import quizApi from '../services/quizApi';

const QuizCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('courseName');
  const [sortDir, setSortDir] = useState('asc');

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await quizApi.getCourses(currentPage, pageSize, sortBy, sortDir);
      setCourses(response.data.data.content || []);
      setTotalPages(response.data.data.totalPages || 1);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [currentPage, pageSize, sortBy, sortDir]);

  const columns = [
    { key: 'courseName', label: 'Name' },
    { key: 'description', label: 'Description' },
    { 
      key: 'courseLevel', 
      label: 'Level',
      render: (val) => val ? <span className="quiz-badge quiz-badge-info">{val}</span> : '-'
    },
    { 
      key: 'courseType', 
      label: 'Type',
      render: (val) => val ? <span className="quiz-badge quiz-badge-secondary">{val}</span> : '-'
    },
    { key: 'affiliation', label: 'Affiliation' },
  ];

  return (
    <QuizLayout title="Courses Management">
      <QuizDataTable
        columns={columns}
        data={courses}
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
    </QuizLayout>
  );
};

export default QuizCourses;
