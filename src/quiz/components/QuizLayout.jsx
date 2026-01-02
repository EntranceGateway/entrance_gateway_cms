import QuizSidebar from './QuizSidebar';

const QuizLayout = ({ children, title, action }) => {
  return (
    <div className="quiz-container">
      <QuizSidebar />
      <main className="quiz-main-content">
        <header className="quiz-top-bar">
          <h1>{title}</h1>
          {action}
        </header>
        <div className="quiz-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default QuizLayout;
