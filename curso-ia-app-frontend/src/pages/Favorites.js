// src/pages/Favorites.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import './Favorites.css';

const Favorites = () => {
  const { theme } = useTheme();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulamos la carga de datos de favoritos
    setTimeout(() => {
      const mockFavorites = [
        {
          id: '1',
          title: 'Python para Ciencia de Datos',
          description: 'Aprende a utilizar Python para análisis de datos, visualización y machine learning.',
          modules: 5,
          progress: 75,
          lastAccessed: '2023-11-28T14:32:00'
        },
        {
          id: '2',
          title: 'Desarrollo Web Full Stack',
          description: 'Domina las tecnologías frontend y backend para crear aplicaciones web completas.',
          modules: 8,
          progress: 40,
          lastAccessed: '2023-11-25T09:15:00'
        },
        {
          id: '3',
          title: 'Docker para Desarrolladores',
          description: 'Aprende a utilizar contenedores para simplificar el desarrollo y despliegue de aplicaciones.',
          modules: 4,
          progress: 90,
          lastAccessed: '2023-11-27T16:45:00'
        }
      ];
      
      setFavorites(mockFavorites);
      setLoading(false);
    }, 1000);
  }, []);
  
  const removeFromFavorites = (id) => {
    setFavorites(favorites.filter(course => course.id !== id));
  };
  
  if (loading) {
    return (
      <div className={`favorites-container ${theme}`}>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando tus cursos favoritos...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`favorites-container ${theme}`}>
      <h1>Mis Cursos Favoritos</h1>
      
      {favorites.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-heart-broken"></i>
          <h2>No tienes cursos favoritos</h2>
          <p>Marca como favorito los cursos que más te gusten para acceder a ellos rápidamente.</p>
          <Link to="/" className="btn btn-primary">Explorar cursos</Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map(course => (
            <div key={course.id} className="favorite-card">
              <div className="card-header">
                <h2>{course.title}</h2>
                <button 
                  className="btn-icon" 
                  onClick={() => removeFromFavorites(course.id)}
                  title="Eliminar de favoritos"
                >
                  <i className="fas fa-heart"></i>
                </button>
              </div>
              
              <p className="course-description">{course.description}</p>
              
              <div className="course-stats">
                <div className="stat-item">
                  <i className="fas fa-book"></i>
                  <span>{course.modules} módulos</span>
                </div>
                <div className="stat-item">
                  <i className="fas fa-clock"></i>
                  <span>Último acceso: {new Date(course.lastAccessed).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="progress-container">
                <div className="progress-label">
                  <span>Progreso</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="card-actions">
                <Link to={`/courses/${course.id}`} className="btn btn-primary">
                  Continuar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;