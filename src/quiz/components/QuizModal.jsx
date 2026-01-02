const QuizModal = ({ show, onClose, title, children }) => {
  if (!show) return null;

  return (
    <div className={`quiz-modal ${show ? 'show' : ''}`} onClick={onClose}>
      <div className="quiz-modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="quiz-close" onClick={onClose}>&times;</span>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default QuizModal;
