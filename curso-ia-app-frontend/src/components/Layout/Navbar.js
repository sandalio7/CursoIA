import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import './Navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <button 
          className="navbar-toggler sidebar-toggle" 
          type="button" 
          onClick={toggleSidebar}
        >
          <i className="bi bi-list"></i>
        </button>
        
        <Link to="/" className="navbar-brand">
          <i className="bi bi-mortarboard-fill me-2"></i>
          Generador de Cursos IA
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                <i className="bi bi-speedometer2 me-1"></i>
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/create" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                <i className="bi bi-plus-circle me-1"></i>
                Crear Curso
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/my-courses" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                <i className="bi bi-book me-1"></i>
                Mis Cursos
              </NavLink>
            </li>
          </ul>
          
          <div className="d-flex align-items-center">
            <button 
              onClick={toggleTheme} 
              className="btn theme-toggle-btn me-3"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <i className="bi bi-sun-fill"></i>
              ) : (
                <i className="bi bi-moon-fill"></i>
              )}
            </button>
            
            <div className="dropdown">
              <button 
                className="btn user-dropdown-toggle" 
                type="button" 
                id="userDropdown" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <i className="bi bi-person-circle me-1"></i>
                <span className="d-none d-md-inline">Usuario</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><Link className="dropdown-item" to="/profile"><i className="bi bi-person me-2"></i>Perfil</Link></li>
                <li><Link className="dropdown-item" to="/settings"><i className="bi bi-gear me-2"></i>Configuración</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={() => console.log('Cerrar sesión')}><i className="bi bi-box-arrow-right me-2"></i>Cerrar sesión</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;