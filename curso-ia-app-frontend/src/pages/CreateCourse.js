// Actualizar src/pages/CreateCourse.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../services/api';
import { ThemeContext } from '../context/ThemeContext';
import './CreateCourse.css';

const CreateCourse = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    topic: '',
    user_profile: '',
    learning_goal: '',
    additional_options: ''
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
    setError(null);

    try {
      const response = await courseService.createCourse({
        topic: formData.topic,
        userProfile: formData.user_profile,
        learningGoal: formData.learning_goal,
        additionalOptions: formData.additional_options
      });
      navigate(`/courses/${response.id}`);
    } catch (err) {
      console.error('Error creating course:', err);
      setError('Hubo un error al generar el curso. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-course-container">
      <div className="create-course-header">
        <h1>Crear un Nuevo Curso</h1>
        <p>Personaliza tu curso ingresando la información a continuación</p>
      </div>

      <div className="form-container">
        {error && (
          <div className="alert alert-danger mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="topic" className="form-label">
              Tema del Curso <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="Ej: Desarrollo Web con React"
              required
            />
            <div className="form-text">
              Indica el tema principal que deseas aprender.
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="user_profile" className="form-label">
              Tu Perfil <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control"
              id="user_profile"
              name="user_profile"
              value={formData.user_profile}
              onChange={handleChange}
              rows="3"
              placeholder="Ej: Tengo conocimientos básicos de HTML y CSS, pero nunca he usado React."
              required
            ></textarea>
            <div className="form-text">
              Describe tus conocimientos previos, experiencia y nivel actual.
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="learning_goal" className="form-label">
              Objetivo de Aprendizaje <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control"
              id="learning_goal"
              name="learning_goal"
              value={formData.learning_goal}
              onChange={handleChange}
              rows="3"
              placeholder="Ej: Quiero aprender a crear aplicaciones web interactivas con React y entender los fundamentos del desarrollo frontend."
              required
            ></textarea>
            <div className="form-text">
              ¿Qué esperas lograr o aprender con este curso?
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="additional_options" className="form-label">
              Opciones Adicionales
            </label>
            <textarea
              className="form-control"
              id="additional_options"
              name="additional_options"
              value={formData.additional_options}
              onChange={handleChange}
              rows="3"
              placeholder="Ej: Me gustaría que el curso incluya ejemplos prácticos y proyectos reales."
            ></textarea>
            <div className="form-text">
              Cualquier preferencia específica, requisito o enfoque que desees para tu curso (opcional).
            </div>
          </div>

          <div className="button-group">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Generando curso...
                </>
              ) : 'Generar Curso'}
            </button>
          </div>
        </form>
      </div>

      <div className="tips-section">
        <h3>Consejos para obtener mejores resultados</h3>
        
        <div className="tip-item">
          <div className="tip-icon">
            <i className="bi bi-bullseye"></i>
          </div>
          <div className="tip-content">
            <div className="tip-title">Sé específico con el tema</div>
            <div className="tip-description">
              En lugar de "Programación", intenta "Programación en Python para análisis de datos"
            </div>
          </div>
        </div>
        
        <div className="tip-item">
          <div className="tip-icon">
            <i className="bi bi-person-badge"></i>
          </div>
          <div className="tip-content">
            <div className="tip-title">Detalla tu perfil</div>
            <div className="tip-description">
              Cuanto más clara sea tu descripción de conocimientos previos, mejor adaptado será el curso
            </div>
          </div>
        </div>
        
        <div className="tip-item">
          <div className="tip-icon">
            <i className="bi bi-check2-square"></i>
          </div>
          <div className="tip-content">
            <div className="tip-title">Define objetivos claros</div>
            <div className="tip-description">
              "Crear una API REST con NodeJS" es mejor que "Aprender NodeJS"
            </div>
          </div>
        </div>
        
        <div className="tip-item">
          <div className="tip-icon">
            <i className="bi bi-info-circle"></i>
          </div>
          <div className="tip-content">
            <div className="tip-title">Incluye contexto</div>
            <div className="tip-description">
              Menciona para qué necesitas aprender este tema o en qué lo aplicarás
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;