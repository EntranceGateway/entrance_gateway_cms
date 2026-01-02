import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import QuizLayout from '../components/QuizLayout';
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
    { title: 'Total Courses', value: stats.courses, icon: '📚', link: '/quiz/courses', color: 'primary' },
    { title: 'Categories', value: stats.categories, icon: '📁', link: '/quiz/categories', color: 'success' },
    { title: 'Question Sets', value: stats.questionSets, icon: '📝', link: '/quiz/question-sets', color: 'warning' },
    { title: 'Quiz Results', value: stats.results, icon: '🏆', link: '/quiz/results', color: 'info' },
  ];

  if (loading) {
    return (
      <QuizLayout title="Dashboard">
        <div className="quiz-loading">Loading dashboard...</div>
      </QuizLayout>
    );
  }

  return (
    <QuizLayout title="📊 Quiz Dashboard">
      <div style={{ marginBottom: '30px' }}>
        <p style={{ color: '#64748b', fontSize: '16px' }}>
          Welcome back! Here's an overview of your quiz platform.
        </p>
      </div>
      
      <div className="quiz-dashboard-cards">
        {cards.map((card, index) => (
          <div className="quiz-card" key={index}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3>{card.title}</h3>
                <p className="quiz-card-number">{card.value.toLocaleString()}</p>
              </div>
              <span style={{ 
                fontSize: '36px', 
                opacity: 0.8,
                filter: 'grayscale(0)'
              }}>
                {card.icon}
              </span>
            </div>
            <Link to={card.link} className="quiz-card-link">View All</Link>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '40px', 
        padding: '30px', 
        background: 'white', 
        borderRadius: '20px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(226, 232, 240, 0.5)'
      }}>
        <h3 style={{ marginBottom: '20px', color: '#1e293b', fontSize: '18px', fontWeight: '700' }}>
          🚀 Quick Actions
        </h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <Link to="/quiz/categories" className="quiz-btn quiz-btn-primary">
            <span>➕</span> Add Category
          </Link>
          <Link to="/quiz/question-sets" className="quiz-btn quiz-btn-secondary">
            <span>📝</span> Create Question Set
          </Link>
          <Link to="/quiz/questions" className="quiz-btn quiz-btn-secondary">
            <span>❓</span> Add Questions
          </Link>
        </div>
      </div>
    </QuizLayout>
  );
};

export default QuizDashboard;
