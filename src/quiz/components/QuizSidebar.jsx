import { NavLink, useNavigate } from 'react-router-dom';

const QuizSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/admin/login', { replace: true });
  };

  const handleBackToCMS = () => {
    navigate('/');
  };

  const menuItems = [
    { path: '/quiz', label: 'Quiz Dashboard', icon: '📊', end: true },
    { path: '/quiz/categories', label: 'Quiz Categories', icon: '📁' },
    { path: '/quiz/courses', label: 'Quiz Courses', icon: '📚' },
    { path: '/quiz/question-sets', label: 'Question Sets', icon: '📝' },
    { path: '/quiz/questions', label: 'Questions', icon: '❓' },
    { path: '/quiz/results', label: 'Quiz Results', icon: '🏆' },
  ];

  return (
    <nav className="quiz-sidebar">
      <div className="quiz-sidebar-header">
        <h2>🎓 Entrance Gateway</h2>
        <p>Quiz Management System</p>
      </div>
      <ul className="quiz-nav-menu">
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink to={item.path} end={item.end}>
              <span style={{ marginRight: '12px', fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="quiz-sidebar-actions">
        <button className="back-btn" onClick={handleBackToCMS}>
          <span>⬅️</span>
          Back to Main CMS
        </button>
        <button className="quiz-logout-btn" onClick={handleLogout}>
          <span>🚪</span>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default QuizSidebar;
