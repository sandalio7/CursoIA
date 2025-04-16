import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h5>Navegación</h5>
      </div>
      
      <div className="sidebar-menu">
        <NavLink to="/" className={({isActive}) => 
          `sidebar-menu-item ${isActive ? 'active' : ''}`
        }>
          <i className="bi bi-speedometer2"></i>
          <span>Dashboard</span>
        </NavLink>
        
        <div className="sidebar-section">
          <h6>Cursos</h6>
        </div>
        
        <NavLink to="/create" className={({isActive}) => 
          `sidebar-menu-item ${isActive ? 'active' : ''}`
        }>
          <i className="bi bi-plus-circle"></i>
          <span>Crear Curso</span>
        </NavLink>
        
        <NavLink to="/my-courses" className={({isActive}) => 
          `sidebar-menu-item ${isActive ? 'active' : ''}`
        }>
          <i className="bi bi-book"></i>
          <span>Mis Cursos</span>
        </NavLink>
        
        <NavLink to="/recent" className={({isActive}) => 
          `sidebar-menu-item ${isActive ? 'active' : ''}`
        }>
          <i className="bi bi-clock-history"></i>
          <span>Recientes</span>
        </NavLink>
        
        <div className="sidebar-section">
          <h6>Categorías</h6>
        </div>
        
        <NavLink to="/categories/programming" className={({isActive}) => 
          `sidebar-menu-item ${isActive ? 'active' : ''}`
        }>
          <i className="bi bi-code-square"></i>
          <span>Programación</span>
        </NavLink>
        
        <NavLink to="/categories/language" className={({isActive}) => 
          `sidebar-menu-item ${isActive ? 'active' : ''}`
        }>
          <i className="bi bi-translate"></i>
          <span>Idiomas</span>
        </NavLink>
        
        <NavLink to="/categories/business" className={({isActive}) => 
          `sidebar-menu-item ${isActive ? 'active' : ''}`
        }>
          <i className="bi bi-briefcase"></i>
          <span>Negocios</span>
        </NavLink>
        
        <NavLink to="/categories/science" className={({isActive}) => 
          `sidebar-menu-item ${isActive ? 'active' : ''}`
        }>
          <i className="bi bi-flask"></i>
          <span>Ciencias</span>
        </NavLink>
        
        <div className="sidebar-section">
          <h6>Herramientas</h6>
        </div>
        
        <NavLink to="/settings" className={({isActive}) => 
          `sidebar-menu-item ${isActive ? 'active' : ''}`
        }>
          <i className="bi bi-gear"></i>
          <span>Configuración</span>
        </NavLink>
        
        <NavLink to="/help" className={({isActive}) => 
          `sidebar-menu-item ${isActive ? 'active' : ''}`
        }>
          <i className="bi bi-question-circle"></i>
          <span>Ayuda</span>
        </NavLink>
      </div>
      
      <div className="sidebar-footer">
        <p>Generador de Cursos IA v1.0</p>
      </div>
    </div>
  );
};

export default Sidebar;