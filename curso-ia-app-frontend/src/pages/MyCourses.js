import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyCourses.css';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtro
  const [filter, setFilter] = useState('all'); // all, inProgress, completed
  
  // Simulación de carga de cursos
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Simular una llamada a la API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Datos de ejemplo
        const mockCourses = [
          {
            id: '1',
            title: 'Introducción a JavaScript',
            description: 'Fundamentos de JavaScript para principiantes',
            totalModules: 8,
            completedModules: 6,
            lastAccessed: '2023-10-15',
            progress: 75
          },
          {
            id: '2',
            title: 'React para Desarrolladores Frontend',
            description: 'Aprende a crear aplicaciones web modernas con React',
            totalModules: 12,
            completedModules: 3,
            lastAccessed: '2023-10-12',
            progress: 25
          },
          {
            id: '3',
            title: 'Python para Ciencia de Datos',
            description: 'Domina las herramientas esenciales para análisis de datos con Python',
            totalModules: 10,
            completedModules: 10,
            lastAccessed: '2023-09-28',
            progress: 100
          },
          {
            id: '4',
            title: 'Desarrollo Web Full Stack',
            description: 'Desde HTML/CSS hasta Node.js y bases de datos',
            totalModules: 15,
            completedModules: 2,
            lastAccessed: '2023-10-05',
            progress: 13
          },
          {
            id: '5',
            title: 'Docker y Kubernetes',
            description: 'Aprende a contenerizar y orquestar aplicaciones',
            totalModules: 8,
            completedModules: 8,
            lastAccessed: '2023-09-20',
            progress: 100
          }
        ];
        
        setCourses(mockCourses);
      } catch (err) {
        setError('Error al cargar los cursos. Por favor, intenta de nuevo.');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  // Filtrar cursos según selección
  const getFilteredCourses = () => {
    switch (filter) {
      case 'inProgress':
        return courses.filter(course => course.progress > 0 && course.progress < 100);
      case 'completed':
        return courses.filter(course => course.progress === 100);
      default:
        return courses;
    }
  };
  
  // Función para eliminar un curso (simulada)
  const handleDeleteCourse = (courseId) => {
    setCourses(courses.filter(course => course.id !== courseId));
  };
  
  // Mostrar estados de carga y error
  if (loading) {
    return (
      <div className="my-courses-loading">
        <div className="my-courses-loading-spinner"></div>
        <p>Cargando cursos...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="my-courses-error">
        <i className="fas fa-exclamation-circle"></i>
        <h3>Error</h3>
        <p>{error}</p>
        <button className="my-courses-error-btn" onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }
  
  const filteredCourses = getFilteredCourses();
  
  return (
    <div className="my-courses">
      <div className="my-courses-header">
        <h1 className="my-courses-title">Mis Cursos</h1>
        
        <div className="my-courses-actions">
          <div className="my-courses-filter">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todos
            </button>
            <button 
              className={`filter-btn ${filter === 'inProgress' ? 'active' : ''}`}
              onClick={() => setFilter('inProgress')}
            >
              En progreso
            </button>
            <button 
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completados
            </button>
          </div>
          
          <Link to="/create" className="my-courses-create-btn">
            <i className="fas fa-plus"></i> Crear Curso
          </Link>
        </div>
      </div>
      
      {filteredCourses.length === 0 ? (
        <div className="my-courses-empty">
          <div className="my-courses-empty-icon">
            <i className="fas fa-book"></i>
          </div>
          <h3 className="my-courses-empty-title">No hay cursos disponibles</h3>
          <p className="my-courses-empty-text">
            {filter === 'all' 
              ? 'Aún no has creado ningún curso. ¡Crea tu primer curso personalizado ahora!'
              : filter === 'inProgress'
                ? 'No tienes cursos en progreso actualmente.'
                : 'No has completado ningún curso todavía.'
            }
          </p>
          {filter === 'all' && (
            <Link to="/create" className="my-courses-empty-btn">
              Crear mi primer curso
            </Link>
          )}
        </div>
      ) : (
        <div className="my-courses-grid">
          {filteredCourses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-card-content">
                <div className="course-card-header">
                  <h2 className="course-card-title">{course.title}</h2>
                  <div className="course-card-menu">
                    <button className="course-card-menu-btn">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                    <div className="course-card-menu-dropdown">
                      <Link to={`/course/${course.id}`} className="course-card-menu-item">
                        <i className="fas fa-eye"></i> Ver curso
                      </Link>
                      <button className="course-card-menu-item">
                        <i className="fas fa-edit"></i> Editar
                      </button>
                      <button 
                        className="course-card-menu-item course-card-menu-item-danger"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        <i className="fas fa-trash"></i> Eliminar
                      </button>
                    </div>
                  </div>
                </div>
                
                <p className="course-card-description">{course.description}</p>
                
                <div className="course-card-stats">
                  <div className="course-card-stat">
                    <i className="fas fa-book"></i>
                    <span>{course.totalModules} módulos</span>
                  </div>
                  <div className="course-card-stat">
                    <i className="fas fa-check-circle"></i>
                    <span>{course.completedModules} completados</span>
                  </div>
                  <div className="course-card-stat">
                    <i className="fas fa-clock"></i>
                    <span>Último acceso: {course.lastAccessed}</span>
                  </div>
                </div>
              </div>
              
              <div className="course-card-footer">
                <div className="course-card-progress-container">
                  <div className="course-card-progress-info">
                    <span className="course-card-progress-label">Progreso</span>
                    <span className="course-card-progress-percentage">{course.progress}%</span>
                  </div>
                  <div className="course-card-progress-bar">
                    <div 
                      className="course-card-progress-fill"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <Link to={`/course/${course.id}`} className="course-card-button">
                  {course.progress === 100 ? 'Repasar' : 'Continuar'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;