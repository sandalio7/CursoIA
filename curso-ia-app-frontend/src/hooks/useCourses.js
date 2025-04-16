import { useState, useEffect, useCallback } from 'react';
import { courseService } from '../services/api';

// Custom hook para manejar operaciones relacionadas con cursos
const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todos los cursos
  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await courseService.getAllCourses();
      setCourses(data.courses || []);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al cargar los cursos');
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar un curso específico
  const loadCourse = useCallback(async (courseId) => {
    if (!courseId) return;
    
    setLoading(true);
    setError(null);
    try {
      const courseData = await courseService.getCourse(courseId);
      setCurrentCourse(courseData);
    } catch (err) {
      setError(err.response?.data?.detail || `Error al cargar el curso ${courseId}`);
      console.error('Error loading course:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear un nuevo curso
  const createCourse = useCallback(async (courseData) => {
    setLoading(true);
    setError(null);
    try {
      const newCourse = await courseService.createCourse(courseData);
      // Actualizar la lista de cursos
      setCourses(prevCourses => [...prevCourses, newCourse]);
      return newCourse;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al crear el curso');
      console.error('Error creating course:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar un curso
  const deleteCourse = useCallback(async (courseId) => {
    setLoading(true);
    setError(null);
    try {
      await courseService.deleteCourse(courseId);
      // Actualizar la lista de cursos
      setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
      if (currentCourse && currentCourse.id === courseId) {
        setCurrentCourse(null);
      }
    } catch (err) {
      setError(err.response?.data?.detail || `Error al eliminar el curso ${courseId}`);
      console.error('Error deleting course:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentCourse]);

  // Cargar contenido de un subtema
  const loadSubtopicContent = useCallback(async (courseId, moduleId, subtopicId) => {
    setLoading(true);
    setError(null);
    try {
      const content = await courseService.getSubtopicContent(courseId, moduleId, subtopicId);
      return content;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al cargar el contenido');
      console.error('Error loading content:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar quiz de un subtema
  const loadSubtopicQuiz = useCallback(async (courseId, moduleId, subtopicId) => {
    setLoading(true);
    setError(null);
    try {
      const quiz = await courseService.getSubtopicQuiz(courseId, moduleId, subtopicId);
      return quiz;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al cargar el quiz');
      console.error('Error loading quiz:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar proyecto práctico de un subtema
  const loadSubtopicProject = useCallback(async (courseId, moduleId, subtopicId) => {
    setLoading(true);
    setError(null);
    try {
      const project = await courseService.getSubtopicProject(courseId, moduleId, subtopicId);
      return project;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al cargar el proyecto');
      console.error('Error loading project:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Marcar subtema como completado
  const markSubtopicCompleted = useCallback(async (courseId, moduleId, subtopicId) => {
    try {
      const result = await courseService.markSubtopicCompleted(courseId, moduleId, subtopicId);
      
      // Actualizar el estado del curso actual si es necesario
      if (currentCourse && currentCourse.id === courseId) {
        // Actualizar el estado de completado en el curso actual
        setCurrentCourse(prevCourse => {
          const updatedCourse = { ...prevCourse };
          const module = updatedCourse.modules.find(m => m.id === moduleId);
          if (module) {
            const subtopic = module.subtopics.find(s => s.id === subtopicId);
            if (subtopic) {
              subtopic.completed = true;
            }
          }
          return updatedCourse;
        });
      }
      
      return result;
    } catch (err) {
      console.error('Error marking subtopic as completed:', err);
      throw err;
    }
  }, [currentCourse]);

  // Enviar respuestas de quiz
  const submitQuizAnswers = useCallback(async (courseId, moduleId, subtopicId, answers) => {
    try {
      const result = await courseService.submitQuizAnswers(courseId, moduleId, subtopicId, answers);
      return result;
    } catch (err) {
      console.error('Error submitting quiz answers:', err);
      throw err;
    }
  }, []);

  return {
    courses,
    currentCourse,
    loading,
    error,
    loadCourses,
    loadCourse,
    createCourse,
    deleteCourse,
    loadSubtopicContent,
    loadSubtopicQuiz,
    loadSubtopicProject,
    markSubtopicCompleted,
    submitQuizAnswers
  };
};

export default useCourses;