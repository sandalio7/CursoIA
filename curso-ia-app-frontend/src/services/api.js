import axios from 'axios';

// Configuración base de axios con interceptores
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí podrías manejar errores comunes (401, 403, 500, etc.)
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

// Servicio de cursos
const courseService = {
  // Crear un nuevo curso a partir de los inputs del usuario
  createCourse: async ({ topic, userProfile, learningGoal, additionalOptions, depth = 'standard' }) => {
    const response = await api.post('/courses', {
      topic,
      user_profile: userProfile,
      learning_goal: learningGoal,
      additional_options: additionalOptions,
      depth // Nivel de profundidad del curso
    });
    return response.data;
  },
  
  // Obtener todos los cursos del usuario
  getAllCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },
  
  // Obtener un curso específico por ID
  getCourse: async (courseId) => {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  },
  
  // Eliminar un curso
  deleteCourse: async (courseId) => {
    const response = await api.delete(`/courses/${courseId}`);
    return response.data;
  },
  
  // Obtener el contenido de un subtema específico
  getSubtopicContent: async (courseId, moduleId, subtopicId) => {
    const response = await api.get(`/content/${courseId}/${moduleId}/${subtopicId}`);
    return response.data;
  },
  
  // Obtener el quiz de un subtema
  getSubtopicQuiz: async (courseId, moduleId, subtopicId) => {
    const response = await api.get(`/content/${courseId}/${moduleId}/${subtopicId}/quiz`);
    return response.data;
  },
  
  // Enviar respuestas de quiz
  submitQuizAnswers: async (courseId, moduleId, subtopicId, answers) => {
    const response = await api.post(`/content/${courseId}/${moduleId}/${subtopicId}/quiz/submit`, {
      answers
    });
    return response.data;
  },
  
  // Obtener el proyecto práctico de un subtema
  getSubtopicProject: async (courseId, moduleId, subtopicId) => {
    const response = await api.get(`/content/${courseId}/${moduleId}/${subtopicId}/project`);
    return response.data;
  },
  
  // Marcar un subtema como completado
  markSubtopicCompleted: async (courseId, moduleId, subtopicId) => {
    const response = await api.post(`/progress/${courseId}/${moduleId}/${subtopicId}/complete`);
    return response.data;
  },
  
  // Obtener estadísticas del usuario
  getUserStats: async () => {
    const response = await api.get('/user/stats');
    return response.data;
  }
};

// Servicio de preferencias de usuario
const userPreferenceService = {
  // Guardar tema (claro/oscuro)
  saveThemePreference: async (theme) => {
    const response = await api.post('/user/preferences/theme', { theme });
    return response.data;
  },
  
  // Obtener preferencias del usuario
  getUserPreferences: async () => {
    const response = await api.get('/user/preferences');
    return response.data;
  }
};

export { courseService, userPreferenceService, api };