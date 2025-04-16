import React from 'react';
import { Routes, Route } from 'react-router-dom';
// Importar páginas
import HomePage from '../pages/HomePage';
import Dashboard from '../pages/Dashboard';
import CreateCourse from '../pages/CreateCourse';
import CourseDetail from '../pages/CourseDetail';
import MyCourses from '../pages/MyCourses';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create" element={<CreateCourse />} />
      <Route path="/courses/:courseId" element={<CourseDetail />} />
      <Route path="/my-courses" element={<MyCourses />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;