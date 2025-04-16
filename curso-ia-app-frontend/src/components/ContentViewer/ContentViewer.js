import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import useCourses from '../../hooks/useCourses';
import Quiz from '../Quiz/Quiz';
import PracticalProject from '../PracticalProject/PracticalProject';
import './ContentViewer.css';

const ContentViewer = ({ courseId, moduleId, subtopicId }) => {
  const [content, setContent] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('content');
  const [loadingStates, setLoadingStates] = useState({
    content: false,
    quiz: false,
    project: false,
  });
  const { 
    loadSubtopicContent, 
    loadSubtopicQuiz, 
    loadSubtopicProject,
    markSubtopicCompleted,
    submitQuizAnswers,
    error 
  } = useCourses();

  // Efecto para cargar el contenido cuando cambia el subtema seleccionado
  useEffect(() => {
    const fetchContent = async () => {
      if (!courseId || !moduleId || !subtopicId) return;
      
      // Resetear estados
      setContent(null);
      setQuiz(null);
      setProject(null);
      setActiveTab('content');
      
      // Cargar contenido
      setLoadingStates(prev => ({ ...prev, content: true }));
      try {
        const contentData = await loadSubtopicContent(courseId, moduleId, subtopicId);
        setContent(contentData);
      } catch (err) {
        console.error('Error loading content:', err);
      } finally {
        setLoadingStates(prev => ({ ...prev, content: false }));
      }
    };

    fetchContent();
  }, [courseId, moduleId, subtopicId, loadSubtopicContent]);

  // Cargar quiz cuando el usuario cambia a la pestaña de quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      if (activeTab === 'quiz' && !quiz && !loadingStates.quiz) {
        setLoadingStates(prev => ({ ...prev, quiz: true }));
        try {
          const quizData = await loadSubtopicQuiz(courseId, moduleId, subtopicId);
          setQuiz(quizData);
        } catch (err) {
          console.error('Error loading quiz:', err);
        } finally {
          setLoadingStates(prev => ({ ...prev, quiz: false }));
        }
      }
    };

    fetchQuiz();
  }, [activeTab, quiz, courseId, moduleId, subtopicId, loadSubtopicQuiz, loadingStates.quiz]);

  // Cargar proyecto cuando el usuario cambia a la pestaña de proyecto
  useEffect(() => {
    const fetchProject = async () => {
      if (activeTab === 'project' && !project && !loadingStates.project) {
        setLoadingStates(prev => ({ ...prev, project: true }));
        try {
          const projectData = await loadSubtopicProject(courseId, moduleId, subtopicId);
          setProject(projectData);
        } catch (err) {
          console.error('Error loading project:', err);
        } finally {
          setLoadingStates(prev => ({ ...prev, project: false }));
        }
      }
    };

    fetchProject();
  }, [activeTab, project, courseId, moduleId, subtopicId, loadSubtopicProject, loadingStates.project]);

  // Manejar la finalización del quiz
  const handleQuizComplete = async (quizResults) => {
    try {
      await submitQuizAnswers(
        courseId,
        moduleId,
        subtopicId,
        quizResults.answers
      );
      
      // Marcar el subtema como completado
      await markSubtopicCompleted(courseId, moduleId, subtopicId);
      
      return true;
    } catch (err) {
      console.error('Error submitting quiz results:', err);
      return false;
    }
  };

  // Manejar la finalización del proyecto
  const handleProjectComplete = async () => {
    try {
      await markSubtopicCompleted(courseId, moduleId, subtopicId);
      return true;
    } catch (err) {
      console.error('Error marking project as completed:', err);
      return false;
    }
  };

  // Verificar si hay un error o si no se ha seleccionado un subtema
  if (error) {
    return (
      <div className="content-viewer-error">
        <i className="fas fa-exclamation-circle content-viewer-error-icon"></i>
        <h3>Error al cargar el contenido</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!courseId || !moduleId || !subtopicId) {
    return (
      <div className="content-viewer-placeholder">
        <i className="fas fa-book-open content-viewer-placeholder-icon"></i>
        <h3>Selecciona un tema para comenzar</h3>
        <p>Elige un tema del menú lateral para ver su contenido.</p>
      </div>
    );
  }

  // Mostrar cargador mientras se obtiene el contenido principal
  if (loadingStates.content) {
    return (
      <div className="content-viewer-loading">
        <div className="content-viewer-loading-spinner"></div>
        <p>Cargando contenido...</p>
      </div>
    );
  }

  // Verificar si hay contenido disponible
  if (!content) {
    return (
      <div className="content-viewer-empty">
        <i className="fas fa-file-alt content-viewer-empty-icon"></i>
        <h3>No hay contenido disponible</h3>
        <p>No se encontró contenido para este subtema.</p>
      </div>
    );
  }

  return (
    <div className="content-viewer">
      {/* Encabezado del contenido */}
      <div className="content-viewer-header">
        <h1 className="content-viewer-title">{content.title || 'Contenido del subtema'}</h1>
      </div>

      {/* Pestañas de navegación */}
      <div className="content-viewer-tabs">
        <button
          className={`content-viewer-tab ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          <i className="fas fa-file-alt mr-2"></i>
          Contenido
        </button>
        
        <button
          className={`content-viewer-tab ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          <i className="fas fa-question-circle mr-2"></i>
          Quiz
          {loadingStates.quiz && (
            <div className="content-viewer-tab-loader"></div>
          )}
        </button>
        
        <button
          className={`content-viewer-tab ${activeTab === 'project' ? 'active' : ''}`}
          onClick={() => setActiveTab('project')}
        >
          <i className="fas fa-laptop-code mr-2"></i>
          Proyecto
          {loadingStates.project && (
            <div className="content-viewer-tab-loader"></div>
          )}
        </button>
      </div>

      {/* Contenido de las pestañas */}
      <div className="content-viewer-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="content-viewer-tab-content"
          >
            {activeTab === 'content' && (
              <div className="content-viewer-markdown">
                <ReactMarkdown>{content.markdown_content}</ReactMarkdown>
              </div>
            )}

            {activeTab === 'quiz' && (
              <div className="content-viewer-quiz">
                {loadingStates.quiz ? (
                  <div className="content-viewer-loading">
                    <div className="content-viewer-loading-spinner"></div>
                    <p>Cargando quiz...</p>
                  </div>
                ) : (
                  <Quiz
                    questions={quiz?.questions || []}
                    onComplete={handleQuizComplete}
                    courseId={courseId}
                    moduleId={moduleId}
                    subtopicId={subtopicId}
                  />
                )}
              </div>
            )}

            {activeTab === 'project' && (
              <div className="content-viewer-project">
                {loadingStates.project ? (
                  <div className="content-viewer-loading">
                    <div className="content-viewer-loading-spinner"></div>
                    <p>Cargando proyecto...</p>
                  </div>
                ) : (
                  <PracticalProject 
                    project={project}
                    onComplete={handleProjectComplete}
                  />
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContentViewer;