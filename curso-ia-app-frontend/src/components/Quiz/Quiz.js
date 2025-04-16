import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Quiz.css';

// Componentes internos
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import QuizProgress from './QuizProgress';

const Quiz = ({ questions, onComplete, courseId, moduleId, subtopicId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Restablecer el quiz si cambian las preguntas
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setQuizCompleted(false);
    setScore(0);
  }, [questions]);

  // Verificar si hay preguntas
  if (!questions || questions.length === 0) {
    return (
      <div className="quiz-empty-container">
        <div className="quiz-empty">
          <i className="fas fa-exclamation-circle quiz-empty-icon"></i>
          <h3>No hay preguntas disponibles</h3>
          <p>No se encontraron preguntas para este tema.</p>
        </div>
      </div>
    );
  }

  // Manejar la selección de una respuesta
  const handleAnswerSelect = (questionId, optionIndex) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: optionIndex
    });
  };

  // Ir a la siguiente pregunta
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      // Estamos en la última pregunta, mostrar resultados
      calculateScore();
      setShowResults(true);
    }
  };

  // Ir a la pregunta anterior
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  // Calcular la puntuación
  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach(question => {
      const questionId = question.id || question.question; // Fallback si no hay ID
      const userAnswer = userAnswers[questionId];
      
      // Buscar la opción correcta
      const correctOptionIndex = question.options.findIndex(opt => opt.is_correct);
      
      if (userAnswer === correctOptionIndex) {
        correctAnswers++;
      }
    });
    
    setScore(correctAnswers);
  };

  // Finalizar el quiz
  const finishQuiz = async () => {
    if (onComplete) {
      try {
        // Formatear las respuestas para enviar al backend
        const formattedAnswers = Object.entries(userAnswers).map(([questionId, answerIndex]) => ({
          question_id: questionId,
          selected_option: answerIndex
        }));
        
        // Llamar a la función de callback con los resultados
        await onComplete({
          score,
          totalQuestions: questions.length,
          answers: formattedAnswers,
          courseId,
          moduleId,
          subtopicId
        });
        
        setQuizCompleted(true);
      } catch (error) {
        console.error('Error al completar el quiz:', error);
      }
    }
  };

  // Reiniciar el quiz
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
  };

  // Obtener la pregunta actual
  const currentQuestion = questions[currentQuestionIndex];

  // Verificar si la pregunta actual tiene respuesta
  const hasAnsweredCurrent = userAnswers[currentQuestion.id || currentQuestion.question] !== undefined;

  // Verificar si todas las preguntas tienen respuesta
  const allQuestionsAnswered = questions.every(question => 
    userAnswers[question.id || question.question] !== undefined
  );

  // Animación para transición entre preguntas
  const variants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  return (
    <div className="quiz-container">
      {!showResults ? (
        <div className="quiz-questions">
          {/* Barra de progreso */}
          <QuizProgress 
            currentQuestion={currentQuestionIndex + 1} 
            totalQuestions={questions.length}
            answeredQuestions={Object.keys(userAnswers).length}
          />
          
          {/* Pregunta actual */}
          <motion.div
            key={currentQuestionIndex}
            initial="enter"
            animate="center"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3 }}
            className="quiz-question-container"
          >
            <QuizQuestion 
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              selectedOption={userAnswers[currentQuestion.id || currentQuestion.question]}
              onSelectOption={(optionIndex) => 
                handleAnswerSelect(currentQuestion.id || currentQuestion.question, optionIndex)
              }
            />
          </motion.div>
          
          {/* Botones de navegación */}
          <div className="quiz-navigation">
            <button 
              className="quiz-btn quiz-btn-secondary"
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <i className="fas fa-arrow-left mr-2"></i> Anterior
            </button>
            
            {currentQuestionIndex < questions.length - 1 ? (
              <button 
                className="quiz-btn quiz-btn-primary"
                onClick={goToNextQuestion}
                disabled={!hasAnsweredCurrent}
              >
                Siguiente <i className="fas fa-arrow-right ml-2"></i>
              </button>
            ) : (
              <button 
                className="quiz-btn quiz-btn-success"
                onClick={goToNextQuestion}
                disabled={!hasAnsweredCurrent}
              >
                Finalizar <i className="fas fa-check ml-2"></i>
              </button>
            )}
          </div>
        </div>
      ) : (
        <QuizResults 
          score={score}
          totalQuestions={questions.length}
          questions={questions}
          userAnswers={userAnswers}
          onReset={resetQuiz}
          onFinish={finishQuiz}
          completed={quizCompleted}
        />
      )}
    </div>
  );
};

export default Quiz;