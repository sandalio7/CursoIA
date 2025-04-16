import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [recentCourses, setRecentCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await courseService.getAllCourses();
        // Limitamos a los 5 cursos más recientes
        setRecentCourses(response.courses.slice(0, 5));
        setError(null);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('No se pudieron cargar los cursos. Por favor intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    // Simulamos un pequeño retraso para la demostración
    const timer = setTimeout(() => {
      fetchCourses();
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Bienvenido al Generador de Cursos con IA</p>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card stat-card">
            <div className="card-body">
              <h5 className="card-title">Cursos Creados</h5>
              <div className="d-flex align-items-center">
                <i className="bi bi-book stat-icon"></i>
                <span className="stat-value">{isLoading ? '...' : recentCourses.length}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card stat-card">
            <div className="card-body">
              <h5 className="card-title">Módulos Completados</h5>
              <div className="d-flex align-items-center">
                <i className="bi bi-check2-circle stat-icon"></i>
                <span className="stat-value">12</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card stat-card">
            <div className="card-body">
              <h5 className="card-title">Evaluaciones Realizadas</h5>
              <div className="d-flex align-items-center">
                <i className="bi bi-award stat-icon"></i>
                <span className="stat-value">8</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="card recent-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Cursos Recientes</h5>
              <Link to="/my-courses" className="btn btn-sm btn-outline-primary">
                Ver todos
              </Link>
            </div>
            <div className="card-body">
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="mt-3">Cargando cursos...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              ) : recentCourses.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-journal-x empty-icon"></i>
                  <h5 className="mt-3">No hay cursos disponibles</h5>
                  <p className="text-muted">¡Comienza creando tu primer curso!</p>
                  <Link to="/create" className="btn btn-primary mt-2">
                    Crear Curso
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table course-table">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Tema</th>
                        <th>Módulos</th>
                        <th>Fecha de Creación</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentCourses.map((course) => (
                        <tr key={course.id}>
                          <td>
                            <Link to={`/courses/${course.id}`} className="course-title-link">
                              {course.title}
                            </Link>
                          </td>
                          <td>{course.topic}</td>
                          <td>{course.modules ? course.modules.length : 0}</td>
                          <td>
                            {new Date(course.created_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Link to={`/courses/${course.id}`} className="btn btn-sm btn-primary">
                                <i className="bi bi-eye"></i>
                              </Link>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => console.log('Delete course', course.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card quick-actions-card">
            <div className="card-header">
              <h5 className="mb-0">Acciones Rápidas</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link to="/create" className="btn btn-primary">
                  <i className="bi bi-plus-circle me-2"></i>
                  Crear Nuevo Curso
                </Link>
                <Link to="/my-courses" className="btn btn-outline-secondary">
                  <i className="bi bi-collection me-2"></i>
                  Gestionar Mis Cursos
                </Link>
                <Link to="/settings" className="btn btn-outline-secondary">
                  <i className="bi bi-gear me-2"></i>
                  Configuración
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card tips-card">
            <div className="card-header">
              <h5 className="mb-0">Consejos y Sugerencias</h5>
            </div>
            <div className="card-body">
              <div className="tip-item">
                <i className="bi bi-lightbulb tip-icon"></i>
                <div>
                  <h6>Sé específico con tus objetivos</h6>
                  <p>Al crear un curso, detalla claramente qué quieres aprender para obtener mejores resultados.</p>
                </div>
              </div>
              <div className="tip-item">
                <i className="bi bi-diagram-3 tip-icon"></i>
                <div>
                  <h6>Estructura tu aprendizaje</h6>
                  <p>Sigue los módulos en el orden sugerido para una mejor comprensión de los temas.</p>
                </div>
              </div>
              <div className="tip-item">
                <i className="bi bi-pencil-square tip-icon"></i>
                <div>
                  <h6>Realiza los ejercicios prácticos</h6>
                  <p>Completa los proyectos propuestos para consolidar tus conocimientos.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;