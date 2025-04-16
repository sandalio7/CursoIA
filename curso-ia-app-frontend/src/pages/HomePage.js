import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../services/api';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    userProfile: '',
    learningGoal: '',
    additionalOptions: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await courseService.createCourse({
        topic: formData.topic,
        userProfile: formData.userProfile,
        learningGoal: formData.learningGoal,
        additionalOptions: formData.additionalOptions
      });

      // Redirigir a la página del curso
      navigate(`/courses/${response.id}`);
    } catch (error) {
      console.error('Error al crear el curso:', error);
      alert('Hubo un error al crear el curso. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-page">
      <div className="curso-header">
        <h1 className="text-title">CursoIA</h1>
      </div>
      
      <div className="home-content">
        {/* Sección izquierda - Copy */}
        <section className="intro-section">
          <h2 className="intro-title">Aprende lo que sea!</h2>
          <p className="intro-subtitle">
            Crea un curso interactivo para aprender un lenguaje de programación, idioma, carreras...
          </p>
          <ul className="intro-features">
            <li>
              <span className="check-icon">✓</span>
              <span className="feature-text">Curso adaptado a la especialización que quieres aprender</span>
            </li>
            <li>
              <span className="check-icon">✓</span>
              <span className="feature-text">Test al final de cada lección para evaluar tus conocimientos</span>
            </li>
            <li>
              <span className="check-icon">✓</span>
              <span className="feature-text">Proyecto al final de cada módulo con feedback instantáneo sobre tus errores</span>
            </li>
          </ul>
          <button className="btn btn-primary">Mejora a Pro</button>
        </section>

        {/* Sección derecha - Formulario */}
        <section className="form-section">
          <div className="form-card">
            <h2 className="form-title">Crear Curso</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="topic" className="form-label">Que quieres aprender:</label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="quiero aprender python"
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="showOptions"
                  checked={showOptions}
                  onChange={() => setShowOptions(!showOptions)}
                  className="form-checkbox"
                />
                <label htmlFor="showOptions" className="checkbox-label">Mas Opciones</label>
              </div>

              {showOptions && (
                <div className="additional-options">
                  <div className="form-group">
                    <label htmlFor="userProfile" className="form-label">Cuáles son tus conocimientos sobre el tema?</label>
                    <input
                      type="text"
                      id="userProfile"
                      name="userProfile"
                      value={formData.userProfile}
                      onChange={handleChange}
                      placeholder="Describe tu nivel actual y experiencia"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="learningGoal" className="form-label">En qué quieres aplicar estos conocimientos?</label>
                    <input
                      type="text"
                      id="learningGoal"
                      name="learningGoal"
                      value={formData.learningGoal}
                      onChange={handleChange}
                      placeholder="Cuál es tu objetivo de aprendizaje"
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="additionalOptions" className="form-label">Opciones adicionales:</label>
                    <input
                      type="text"
                      id="additionalOptions"
                      name="additionalOptions"
                      value={formData.additionalOptions}
                      onChange={handleChange}
                      placeholder="Cualquier otra especificación para tu curso"
                      className="form-control"
                    />
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary btn-block" 
                disabled={isLoading}
              >
                {isLoading ? 'Generando Curso...' : 'Generar Curso'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;