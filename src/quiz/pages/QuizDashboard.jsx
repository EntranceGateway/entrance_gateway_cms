import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import { BookOpen, FolderOpen, FileText, Trophy, Plus, HelpCircle, LayoutDashboard } from 'lucide-react';
import quizApi from '../services/quizApi';

const QuizDashboard = () => {
  const [stats, setStats] = useState({
    courses: 0,
    categories: 0,
    questionSets: 0,
    results: 0
  });
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const [coursesRes, categoriesRes, questionSetsRes, resultsRes] = await Promise.all([
        quizApi.getCourses(0, 1).catch(() => ({ data: { data: { totalElements: 0 } } })),
        quizApi.getCategories(0, 1).catch(() => ({ data: { data: { totalElements: 0 } } })),
        quizApi.getQuestionSets(0, 1).catch(() => ({ data: { data: { totalElements: 0 } } })),
        quizApi.getQuizResults(0, 1).catch(() => ({ data: { totalElements: 0 } }))
      ]);

      setStats({
        courses: coursesRes.data.data?.totalElements || 0,
        categories: categoriesRes.data.data?.totalElements || 0,
        questionSets: questionSetsRes.data.data?.totalElements || 0,
        results: resultsRes.data.totalElements || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { title: 'Total Courses', value: stats.courses, icon: BookOpen, link: '/quiz/courses', color: 'bg-indigo-500' },
    { title: 'Categories', value: stats.categories, icon: FolderOpen, link: '/quiz/categories', color: 'bg-emerald-500' },
    { title: 'Question Sets', value: stats.questionSets, icon: FileText, link: '/quiz/question-sets', color: 'bg-amber-500' },
    { title: 'Quiz Results', value: stats.results, icon: Trophy, link: '/quiz/results', color: 'bg-cyan-500' },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2 text-gray-500">
            <span className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent"></span>
            Loading dashboard...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <LayoutDashboard size={24} className="text-indigo-600" />
          Quiz Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here's an overview of your quiz platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">{card.title}</h3>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{card.value.toLocaleString()}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
              <Link 
                to={card.link} 
                className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Plus size={20} className="text-indigo-600" />
          Quick Actions
        </h3>
        <div className="flex gap-4 flex-wrap">
          <Link 
            to="/quiz/categories" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Add Category
          </Link>
          <Link 
            to="/quiz/question-sets" 
            className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <FileText size={18} />
            Create Question Set
          </Link>
          <Link 
            to="/quiz/questions" 
            className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <HelpCircle size={18} />
            Add Questions
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default QuizDashboard;
