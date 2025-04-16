import React from 'react';
import './Quiz.css';

const QuizProgress = ({ currentQuestion, totalQuestions, answeredQuestions }) => {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;
  const completionPercentage = (answeredQuestions / totalQuestions) * 100;
  
  return (
    <div className="quiz-progress">
      <div className="quiz-progress-counters">
        <span className="quiz-progress-text">Pregunta {currentQuestion} de {totalQuestions}</span>
        <span className="quiz-progress-text">Respondidas: {answeredQuestions} de {totalQuestions}</span>
      </div>
      
      <div className="quiz-progress-bar-container">
        {/* Barra de preguntas respondidas */}
        <div 
          className="quiz-progress-bar quiz-progress-answered"
          style={{ width: `${completionPercentage}%` }}
        ></div>
        
        {/* Marcador de pregunta actual */}
        <div 
          className="quiz-progress-current-marker"
          style={{ left: `${progressPercentage}%` }}
        ></div>
        
        {/* Marcadores de todas las preguntas */}
        {Array.from({ length: totalQuestions }).map((_, index) => (
          <div
            key={index}
            className={`quiz-progress-marker ${
              index + 1 < currentQuestion ? 'passed' :
              index + 1 === currentQuestion ? 'current' : ''
            }`}
            style={{ left: `${((index + 1) / totalQuestions) * 100}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default QuizProgress;