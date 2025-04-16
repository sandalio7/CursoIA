// src/pages/Settings.js
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './Settings.css';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className={`settings-container ${theme}`}>
      <h1>Configuración</h1>
      
      <div className="settings-card">
        <h2>Apariencia</h2>
        <div className="setting-option">
          <span>Tema oscuro</span>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={theme === 'dark-theme'} 
              onChange={toggleTheme} 
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
      
      <div className="settings-card">
        <h2>Preferencias de contenido</h2>
        <div className="setting-option">
          <span>Nivel de detalle por defecto</span>
          <select className="form-select">
            <option value="basic">Básico</option>
            <option value="standard" selected>Estándar</option>
            <option value="advanced">Avanzado</option>
          </select>
        </div>
        
        <div className="setting-option">
          <span>Mostrar proyectos prácticos</span>
          <label className="toggle-switch">
            <input type="checkbox" checked />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
      
      <div className="settings-card">
        <h2>Notificaciones</h2>
        <div className="setting-option">
          <span>Notificaciones por email</span>
          <label className="toggle-switch">
            <input type="checkbox" />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
      
      <button className="btn btn-primary save-settings">Guardar cambios</button>
    </div>
  );
};

export default Settings;