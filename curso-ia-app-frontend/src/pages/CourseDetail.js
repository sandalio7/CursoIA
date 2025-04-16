import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ContentViewer from '../components/ContentViewer/ContentViewer';
import './CourseDetail.css';

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [activeSubtopic, setActiveSubtopic] = useState(null);
  
  // Simulación de carga del curso
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        // Simular una llamada a la API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Datos de ejemplo (esto se reemplazará con la llamada a tu API)
        const mockCourse = {
          id: courseId,
          title: "Introducción a JavaScript",
          description: "Un curso completo para principiantes que quieren aprender JavaScript desde cero. Aprenderás los fundamentos, manipulación del DOM, y más.",
          modules: [
            {
              id: "module-1",
              title: "Fundamentos de JavaScript",
              description: "Conceptos básicos para entender JavaScript",
              order: 1,
              subtopics: [
                {
                  id: "subtopic-1-1",
                  title: "Introducción a JavaScript",
                  description: "Historia, evolución y uso actual de JavaScript",
                  completed: false
                },
                {
                  id: "subtopic-1-2",
                  title: "Variables y Tipos de Datos",
                  description: "Cómo declarar variables y los diferentes tipos de datos",
                  completed: false
                },
                {
                  id: "subtopic-1-3",
                  title: "Operadores y Expresiones",
                  description: "Operadores aritméticos, de comparación y lógicos",
                  completed: false
                }
              ]
            },
            {
              id: "module-2",
              title: "Estructuras de Control",
              description: "Flujo de control en JavaScript",
              order: 2,
              subtopics: [
                {
                  id: "subtopic-2-1",
                  title: "Condicionales (if-else)",
                  description: "Toma de decisiones en tu código",
                  completed: false
                },
                {
                  id: "subtopic-2-2",
                  title: "Bucles (for, while)",
                  description: "Cómo hacer tareas repetitivas",
                  completed: false
                },
                {
                  id: "subtopic-2-3",
                  title: "Switch y operador ternario",
                  description: "Alternativas a las estructuras if-else",
                  completed: false
                }
              ]
            },
            {
              id: "module-3",
              title: "Funciones",
              description: "Cómo crear y usar funciones",
              order: 3,
              subtopics: [
                {
                  id: "subtopic-3-1",
                  title: "Declaración de funciones",
                  description: "Diferentes formas de crear funciones",
                  completed: false
                },
                {
                  id: "subtopic-3-2",
                  title: "Parámetros y argumentos",
                  description: "Cómo pasar datos a las funciones",
                  completed: false
                },
                {
                  id: "subtopic-3-3",
                  title: "Funciones de flecha",
                  description: "La sintaxis moderna para funciones",
                  completed: false
                }
              ]
            }
          ]
        };
        
        setCourse(mockCourse);
        
        // Establecer el primer módulo y subtema como activos por defecto
        if (mockCourse.modules && mockCourse.modules.length > 0) {
          setActiveModule(mockCourse.modules[0].id);
          
          if (mockCourse.modules[0].subtopics && mockCourse.modules[0].subtopics.length > 0) {
            setActiveSubtopic(mockCourse.modules[0].subtopics[0].id);
          }
        }
      } catch (err) {
        setError('Error al cargar el curso. Por favor, intenta de nuevo.');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [courseId]);
  
  // Manejar clic en un subtema
  const handleSubtopicClick = (moduleId, subtopicId) => {
    setActiveModule(moduleId);
    setActiveSubtopic(subtopicId);
  };
  
  // Calcular progreso del curso
  const calculateProgress = () => {
    if (!course) return 0;
    
    let totalSubtopics = 0;
    let completedSubtopics = 0;
    
    course.modules.forEach(module => {
      totalSubtopics += module.subtopics.length;
      completedSubtopics += module.subtopics.filter(sub => sub.completed).length;
    });
    
    return totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0;
  };
  
  // Mostrar estados de carga y error
  if (loading) {
    return (
      <div className="course-detail-loading">
        <div className="course-detail-loading-spinner"></div>
        <p>Cargando curso...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="course-detail-error">
        <i className="fas fa-exclamation-circle"></i>
        <h3>Error</h3>
        <p>{error}</p>
        <button className="course-detail-error-btn" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="course-detail-not-found">
        <i className="fas fa-search"></i>
        <h3>Curso no encontrado</h3>
        <p>El curso que buscas no existe o ha sido eliminado.</p>
      </div>
    );
  }
  
  return (
    <div className="course-detail">
      <div className="course-detail-header">
        <div className="course-detail-info">
          <h1 className="course-detail-title">{course.title}</h1>
          <p className="course-detail-description">{course.description}</p>
        </div>
        
        <div className="course-detail-progress-container">
          <div className="course-detail-progress-info">
            <span className="course-detail-progress-label">Progreso del curso</span>
            <span className="course-detail-progress-percentage">{calculateProgress()}%</span>
          </div>
          <div className="course-detail-progress-bar">
            <div 
              className="course-detail-progress-fill"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="course-detail-content">
        <div className="course-detail-sidebar">
          <div className="course-detail-toc">
            <h2 className="course-detail-toc-title">Contenido del Curso</h2>
            
            <div className="course-detail-modules">
              {course.modules.map((module, moduleIndex) => (
                <div key={module.id} className="course-detail-module">
                  <div 
                    className={`course-detail-module-header ${activeModule === module.id ? 'active' : ''}`}
                    onClick={() => setActiveModule(activeModule === module.id ? null : module.id)}
                  >
                    <div className="course-detail-module-number">{moduleIndex + 1}</div>
                    <h3 className="course-detail-module-title">{module.title}</h3>
                    <div className="course-detail-module-toggle">
                      <i className={`fas fa-chevron-${activeModule === module.id ? 'down' : 'right'}`}></i>
                    </div>
                  </div>
                  
                  {activeModule === module.id && (
                    <div className="course-detail-subtopics">
                      {module.subtopics.map((subtopic, subtopicIndex) => (
                        <div 
                          key={subtopic.id}
                          className={`course-detail-subtopic ${activeSubtopic === subtopic.id ? 'active' : ''}`}
                          onClick={() => handleSubtopicClick(module.id, subtopic.id)}
                        >
                          <div className="course-detail-subtopic-number">{moduleIndex + 1}.{subtopicIndex + 1}</div>
                          <div className="course-detail-subtopic-info">
                            <h4 className="course-detail-subtopic-title">{subtopic.title}</h4>
                            <p className="course-detail-subtopic-description">{subtopic.description}</p>
                          </div>
                          {subtopic.completed && (
                            <div className="course-detail-subtopic-completed">
                              <i className="fas fa-check-circle"></i>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="course-detail-viewer">
          {activeModule && activeSubtopic ? (
            <ContentViewer 
              courseId={courseId}
              moduleId={activeModule}
              subtopicId={activeSubtopic}
            />
          ) : (
            <div className="course-detail-placeholder">
              <div className="course-detail-placeholder-icon">
                <i className="fas fa-book-open"></i>
              </div>
              <h3 className="course-detail-placeholder-title">Selecciona un tema para comenzar</h3>
              <p className="course-detail-placeholder-text">
                Elige un tema del índice para ver su contenido
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;