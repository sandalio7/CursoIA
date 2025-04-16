// src/pages/History.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './History.css';

const History = () => {
  const { theme } = useTheme();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    // Simulamos la carga de datos del historial
    setTimeout(() => {
      const mockActivities = [
        {
          id: '1',
          type: 'creation',
          courseId: '101',
          courseTitle: 'Introducción a React',
          timestamp: '2023-11-28T16:30:00',
          details: 'Curso creado con 6 módulos'
        },
        {
          id: '2',
          type: 'completion',
          courseId: '102',
          courseTitle: 'Python para Ciencia de Datos',
          timestamp: '2023-11-27T14:45:00',
          details: 'Módulo 3: Pandas y análisis de datos'
        },
        {
          id: '3',
          type: 'quiz',
          courseId: '102',
          courseTitle: 'Python para Ciencia de Datos',
          timestamp: '2023-11-27T14:20:00',
          details: 'Quiz completado: Introducción a Pandas (Puntuación: 80%)'
        },
        {
          id: '4',
          type: 'project',
          courseId: '103',
          courseTitle: 'Docker para Desarrolladores',
          timestamp: '2023-11-26T11:15:00',
          details: 'Proyecto práctico: Configuración de multi-container con Docker Compose'
        },
        {
          id: '5',
          type: 'completion',
          courseId: '103',
          courseTitle: 'Docker para Desarrolladores',
          timestamp: '2023-11-25T10:30:00',
          details: 'Módulo 2: Redes y volúmenes en Docker'
        }
      ];
      
      setActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, []);
  
  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);
  
  const getActivityIcon = (type) => {
    switch(type) {
      case 'creation': return 'fas fa-plus-circle';
      case 'completion': return 'fas fa-check-circle';
      case 'quiz': return 'fas fa-question-circle';
      case 'project': return 'fas fa-laptop-code';
      default: return 'fas fa-clock';
    }
  };
  
  const getActivityColor = (type) => {
    switch(type) {
      case 'creation': return 'activity-creation';
      case 'completion': return 'activity-completion';
      case 'quiz': return 'activity-quiz';
      case 'project': return 'activity-project';
      default: return '';
    }
  };
  
  if (loading) {
    return (
      <div className={`history-container ${theme}`}>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando tu historial de actividades...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`history-container ${theme}`}>
      <h1>Historial de Actividades</h1>
      
      <div className="filter-controls">
        <label>Filtrar por:</label>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todos
          </button>
          <button 
            className={`filter-btn ${filter === 'creation' ? 'active' : ''}`}
            onClick={() => setFilter('creation')}
          >
            Creación
          </button>
          <button 
            className={`filter-btn ${filter === 'completion' ? 'active' : ''}`}
            onClick={() => setFilter('completion')}
          >
            Completados
          </button>
          <button 
            className={`filter-btn ${filter === 'quiz' ? 'active' : ''}`}
            onClick={() => setFilter('quiz')}
          >
            Quizzes
          </button>
          <button 
            className={`filter-btn ${filter === 'project' ? 'active' : ''}`}
            onClick={() => setFilter('project')}
          >
            Proyectos
          </button>
        </div>
      </div>
      
      {filteredActivities.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-history"></i>
          <h2>No hay actividades para mostrar</h2>
          <p>No se encontraron actividades con los filtros seleccionados.</p>
          {filter !== 'all' && (
            <button 
              className="btn btn-secondary"
              onClick={() => setFilter('all')}
            >
              Mostrar todas las actividades
            </button>
          )}
        </div>
      ) : (
        <div className="timeline">
          {filteredActivities.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className={`activity-icon ${getActivityColor(activity.type)}`}>
                <i className={getActivityIcon(activity.type)}></i>
              </div>
              
              <div className="activity-content">
                <div className="activity-header">
                  <h3>
                    <Link to={`/courses/${activity.courseId}`}>
                      {activity.courseTitle}
                    </Link>
                  </h3>
                  <span className="activity-time">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
                
                <p className="activity-details">{activity.details}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;