import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import './Sidebar.css';

const Sidebar = ({ compact = false, visible = true }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Verificar si una ruta está activa
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`sidebar ${compact ? 'sidebar-compact' : ''} ${!visible ? 'sidebar-hidden' : ''}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-title">CursoIA</h1>
      </div>

      <div className="sidebar-content">
        <div className="sidebar-new-course">
          <div className="new-course-container">
            <Link to="/create" className="new-course-circle">
              <span className='user-initial'>+</span>
            </Link>
            <Link to="/create" className="new-course-text">
              Nuevo Curso
            </Link>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            <li className={`sidebar-menu-item ${isActive('/') || isActive('/dashboard') ? 'active' : ''}`}>
              <Link to="/dashboard">
                <span className="menu-icon">☐</span>
                <span className="menu-text">Dashboard</span>
              </Link>
            </li>
            <li className={`sidebar-menu-item ${isActive('/my-courses') ? 'active' : ''}`}>
              <Link to="/my-courses">
                <span className="menu-icon">☐</span>
                <span className="menu-text">Mis Cursos</span>
              </Link>
            </li>
            <li className={`sidebar-menu-item ${isActive('/my-projects') ? 'active' : ''}`}>
              <Link to="/my-projects">
                <span className="menu-icon">☐</span>
                <span className="menu-text">Mis proyectos</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <span className="user-initial">US</span>
          </div>
          <div className="user-info">
            <span className="user-name">Usuario999</span>
            <span className="user-plan">Cambia a Pro</span>
          </div>
        </div>
        
        <div className="theme-toggle mt-2">
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
            <span className="toggle-text">
              {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;