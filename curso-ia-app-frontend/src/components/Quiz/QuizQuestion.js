import React from 'react';
import './Quiz.css';

const QuizQuestion = ({ question, questionNumber, selectedOption, onSelectOption }) => {
  if (!question) return null;

  return (
    <div className="quiz-question">
      <div className="quiz-question-header">
        <div className="quiz-question-number">Pregunta {questionNumber}</div>
      </div>
      
      <h2 className="quiz-question-text">{question.question}</h2>
      
      <div className="quiz-options">
        {question.options.map((option, index) => (
          <div 
            key={index}
            className={`quiz-option ${selectedOption === index ? 'selected' : ''}`}
            onClick={() => onSelectOption(index)}
          >
            <div className="quiz-option-selector">
              <div className="quiz-option-radio">
                {selectedOption === index && <div className="quiz-option-radio-inner"></div>}
              </div>
              <span className="quiz-option-letter">
                {String.fromCharCode(65 + index)}
              </span>
            </div>
            <div className="quiz-option-text">
              {option.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;