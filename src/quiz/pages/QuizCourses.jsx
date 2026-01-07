import { useState, useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import { BookOpen } from 'lucide-react';
import quizApi from '../services/quizApi';
import Pagination from '../../Verification/Pagination';

const QuizCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await quizApi.getCourses(currentPage, pageSize, 'courseName', 'asc');
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
  }, [currentPage, pageSize]);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen size={24} className="text-indigo-600" />
          Quiz Courses
        </h1>
        <p className="text-gray-500 mt-1">View courses available for quizzes (managed via main Courses section)</p>
      </div>

      {/* Table */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left font-medium text-gray-700">Course Name</th>
                <th className="p-4 text-left font-medium text-gray-700">Category</th>
                <th className="p-4 text-left font-medium text-gray-700">Description</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <span className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></span>
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    No courses found.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.courseId} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{course.courseName}</td>
                    <td className="p-4 text-gray-600">{course.categoryName || '-'}</td>
                    <td className="p-4 text-gray-600">{course.description || '-'}</td>
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
    </Layout>
  );
};

export default QuizCourses;
