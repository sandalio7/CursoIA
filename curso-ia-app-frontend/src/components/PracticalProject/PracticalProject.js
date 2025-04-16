import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import './PracticalProject.css';

const PracticalProject = ({ project, onComplete }) => {
  const [currentSection, setCurrentSection] = useState('introduction');
  const [completed, setCompleted] = useState(false);
  
  if (!project) {
    return (
      <div className="project-empty-container">
        <div className="project-empty">
          <i className="fas fa-exclamation-circle project-empty-icon"></i>
          <h3>No hay proyecto disponible</h3>
          <p>No se encontró un proyecto práctico para este tema.</p>
        </div>
      </div>
    );
  }
  
  const handleComplete = async () => {
    if (onComplete) {
      try {
        await onComplete();
        setCompleted(true);
      } catch (error) {
        console.error('Error al marcar proyecto como completado:', error);
      }
    }
  };
  
  // Lista de secciones en el orden correcto
  const sections = [
    { id: 'introduction', label: 'Introducción', icon: 'info-circle' },
    { id: 'requirements', label: 'Requisitos', icon: 'clipboard-list' },
    { id: 'steps', label: 'Pasos a seguir', icon: 'list-ol' },
    { id: 'success_criteria', label: 'Criterios de éxito', icon: 'check-circle' }
  ];
  
  // Encontrar el índice de la sección actual
  const currentIndex = sections.findIndex(section => section.id === currentSection);
  
  // Ir a la siguiente sección
  const goToNext = () => {
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1].id);
    }
  };
  
  // Ir a la sección anterior
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentSection(sections[currentIndex - 1].id);
    }
  };
  
  // Contenido según la sección actual
  const renderContent = () => {
    switch(currentSection) {
      case 'introduction':
        return project.introduction;
      case 'requirements':
        return project.requirements;
      case 'steps':
        return project.steps;
      case 'success_criteria':
        return project.success_criteria;
      default:
        return project.introduction;
    }
  };
  
  // Progreso en porcentaje
  const progressPercentage = ((currentIndex + 1) / sections.length) * 100;
  
  return (
    <div className="project-container">
      <div className="project-header">
        <h2 className="project-title">
          <i className="fas fa-laptop-code mr-2"></i>
          {project.title}
        </h2>
      </div>
      
      {/* Barra de progreso */}
      <div className="project-progress">
        <div className="project-progress-bar" style={{ width: `${progressPercentage}%` }}></div>
      </div>
      
      {/* Navegación entre secciones */}
      <div className="project-navigation">
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`project-nav-item ${currentSection === section.id ? 'active' : ''}`}
            onClick={() => setCurrentSection(section.id)}
          >
            <div className="project-nav-icon">
              <i className={`fas fa-${section.icon}`}></i>
            </div>
            <span className="project-nav-text">{section.label}</span>
            <div className={`project-nav-indicator ${index <= currentIndex ? 'completed' : ''}`}></div>
          </button>
        ))}
      </div>
      
      {/* Contenido de la sección */}
      <motion.div
        key={currentSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="project-content"
      >
        <div className="project-section-title">
          <h3>{sections[currentIndex].label}</h3>
        </div>
        
        <div className="project-section-content">
          <ReactMarkdown>{renderContent()}</ReactMarkdown>
        </div>
      </motion.div>
      
      {/* Botones de navegación */}
      <div className="project-footer">
        <button
          className="project-btn project-btn-secondary"
          onClick={goToPrevious}
          disabled={currentIndex === 0}
        >
          <i className="fas fa-arrow-left mr-2"></i> Anterior
        </button>
        
        {currentIndex < sections.length - 1 ? (
          <button
            className="project-btn project-btn-primary"
            onClick={goToNext}
          >
            Siguiente <i className="fas fa-arrow-right ml-2"></i>
          </button>
        ) : (
          <button
            className="project-btn project-btn-success"
            onClick={handleComplete}
            disabled={completed}
          >
            {completed ? (
              <>
                <i className="fas fa-check-circle mr-2"></i> Completado
              </>
            ) : (
              <>
                Marcar como completado <i className="fas fa-check ml-2"></i>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default PracticalProject;