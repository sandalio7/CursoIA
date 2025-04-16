import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseService } from '../services/api';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    userProfile: '',
    learningGoal: '',
    additionalOptions: ''
  });

  // Controlar la visibilidad del navbar al hacer scroll
  useEffect(() => {
    let lastScrollTop = 0;
    
    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      if (st > lastScrollTop && st > 50) {
        // Scroll hacia abajo
        setShowNavbar(false);
      } else {
        // Scroll hacia arriba
        setShowNavbar(true);
      }
      lastScrollTop = st <= 0 ? 0 : st;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
    <div className="homepage-container">
      {/* Navbar */}
      <header className={`home-navbar ${showNavbar ? 'visible' : 'hidden'}`}>
        <div className="navbar-container">
          <div className="navbar-logo">
            <Link to="/">CursoIA</Link>
          </div>
          <div className="navbar-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/my-courses">Mis cursos</Link>
          </div>
          <div className="navbar-actions">
            <button className="btn btn-upgrade">Mejora a Pro</button>
            <div className="user-menu">
              <span className="user-icon">
                <i className="bi bi-person-circle"></i>
              </span>
              <span className="user-name">User - Usuario999</span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="homepage-content">
        {/* Sección izquierda - Copy */}
        <section className="hero-section">
          <h1 className="hero-title">Aprende lo que sea!</h1>
          <p className="hero-subtitle">
            Crea un curso interactivo para aprender un lenguaje, idioma,
          </p>
          <ul className="hero-features">
            <li>
              <span className="check-circle"><i className="bi bi-check-circle-fill"></i></span>
              Curso adaptado a la especialización que quieres aprender
            </li>
            <li>
              <span className="check-circle"><i className="bi bi-check-circle-fill"></i></span>
              Test al final de cada lección para evaluar tus conocimientos
            </li>
            <li>
              <span className="check-circle"><i className="bi bi-check-circle-fill"></i></span>
              Proyecto al final de cada módulo con feedback instantáneo sobre tus errores
            </li>
          </ul>
          <button className="btn btn-cta">Mejora a Pro</button>
        </section>

        {/* Sección derecha - Formulario */}
        <section className="course-form-section">
          <div className="course-form-container course-form-pink">
            <h2 className="form-title">Crear Curso</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="topic">Qué quieres aprender:</label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="quiero aprender python"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group form-checkbox">
                <input
                  type="checkbox"
                  id="showOptions"
                  checked={showOptions}
                  onChange={() => setShowOptions(!showOptions)}
                />
                <label htmlFor="showOptions">Más Opciones</label>
              </div>

              {showOptions && (
                <div className="additional-options">
                  <div className="form-group">
                    <label htmlFor="userProfile">Cuáles son tus conocimientos sobre el tema?</label>
                    <input
                      type="text"
                      id="userProfile"
                      name="userProfile"
                      value={formData.userProfile}
                      onChange={handleChange}
                      placeholder="Describe tu nivel actual y experiencia"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="learningGoal">En qué quieres aplicar estos conocimientos?</label>
                    <input
                      type="text"
                      id="learningGoal"
                      name="learningGoal"
                      value={formData.learningGoal}
                      onChange={handleChange}
                      placeholder="Cuál es tu objetivo de aprendizaje"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="additionalOptions">Opciones adicionales:</label>
                    <input
                      type="text"
                      id="additionalOptions"
                      name="additionalOptions"
                      value={formData.additionalOptions}
                      onChange={handleChange}
                      placeholder="Cualquier otra especificación para tu curso"
                      className="form-input"
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-submit" disabled={isLoading}>
                {isLoading ? 'Generando Curso...' : 'Generar Curso'}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;