import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button 
      className="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={`Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`}
    >
      {theme === 'dark' ? (
        <i className="bi bi-sun-fill"></i>
      ) : (
        <i className="bi bi-moon-fill"></i>
      )}
    </button>
  );
};

export default ThemeToggle;