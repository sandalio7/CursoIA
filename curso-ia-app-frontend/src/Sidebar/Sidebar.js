import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  // Verificar si una ruta está activa
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">CursoIA</h1>
      </div>

      <div className="sidebar-content">
        <div className="sidebar-new-course">
          <Link to="/create" className="new-course-button">
            <span className="btn-icon">+</span>
            Nuevo Curso
          </Link>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            <li className={`sidebar-menu-item ${isActive('/dashboard') ? 'active' : ''}`}>
              <Link to="/dashboard">
                <span className="menu-icon">☐</span>
                Dashboard
              </Link>
            </li>
            <li className={`sidebar-menu-item ${isActive('/my-courses') ? 'active' : ''}`}>
              <Link to="/my-courses">
                <span className="menu-icon">☐</span>
                Mis Cursos
              </Link>
            </li>
            <li className={`sidebar-menu-item ${isActive('/my-projects') ? 'active' : ''}`}>
              <Link to="/my-projects">
                <span className="menu-icon">☐</span>
                Mis proyectos
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
      </div>
    </div>
  );
};

export default Sidebar;