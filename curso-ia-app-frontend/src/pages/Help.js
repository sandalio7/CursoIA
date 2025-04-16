// src/pages/Help.js
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './Help.css';

const Help = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`help-container ${theme}`}>
      <h1>Centro de ayuda</h1>
      
      <div className="help-card">
        <h2>Preguntas frecuentes</h2>
        
        <div className="accordion">
          <div className="accordion-item">
            <h3 className="accordion-header">¿Cómo funciona el generador de cursos?</h3>
            <div className="accordion-content">
              <p>Nuestro generador utiliza inteligencia artificial para crear cursos personalizados basados en tus necesidades específicas. Al proporcionar información sobre el tema, tu perfil y objetivos, nuestro sistema crea un programa educativo adaptado a ti.</p>
            </div>
          </div>
          
          <div className="accordion-item">
            <h3 className="accordion-header">¿Puedo descargar el contenido del curso?</h3>
            <div className="accordion-content">
              <p>Actualmente, el contenido está disponible solo en línea, pero estamos trabajando en implementar la funcionalidad de descarga para uso offline en futuras actualizaciones.</p>
            </div>
          </div>
          
          <div className="accordion-item">
            <h3 className="accordion-header">¿Cuánto tiempo se tarda en generar un curso?</h3>
            <div className="accordion-content">
              <p>La generación de la estructura del curso suele tardar entre 15-30 segundos. El contenido detallado de cada subtema se genera bajo demanda cuando accedes a él por primera vez.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="help-card">
        <h2>Guías de uso</h2>
        
        <div className="guides-grid">
          <div className="guide-item">
            <div className="guide-icon">
              <i className="fas fa-magic"></i>
            </div>
            <h3>Crear tu primer curso</h3>
            <a href="#" className="guide-link">Ver guía</a>
          </div>
          
          <div className="guide-item">
            <div className="guide-icon">
              <i className="fas fa-tasks"></i>
            </div>
            <h3>Realizar evaluaciones</h3>
            <a href="#" className="guide-link">Ver guía</a>
          </div>
          
          <div className="guide-item">
            <div className="guide-icon">
              <i className="fas fa-laptop-code"></i>
            </div>
            <h3>Proyectos prácticos</h3>
            <a href="#" className="guide-link">Ver guía</a>
          </div>
          
          <div className="guide-item">
            <div className="guide-icon">
              <i className="fas fa-user-cog"></i>
            </div>
            <h3>Personalizar tu experiencia</h3>
            <a href="#" className="guide-link">Ver guía</a>
          </div>
        </div>
      </div>
      
      <div className="help-card">
        <h2>Contacto de soporte</h2>
        <p>¿No encuentras lo que buscas? Contáctanos directamente:</p>
        
        <form className="contact-form">
          <div className="form-group">
            <label>Asunto</label>
            <input type="text" className="form-control" placeholder="¿En qué podemos ayudarte?" />
          </div>
          
          <div className="form-group">
            <label>Mensaje</label>
            <textarea className="form-control" rows="4" placeholder="Describe tu problema o pregunta"></textarea>
          </div>
          
          <button type="submit" className="btn btn-primary">Enviar mensaje</button>
        </form>
      </div>
    </div>
  );
};

export default Help;