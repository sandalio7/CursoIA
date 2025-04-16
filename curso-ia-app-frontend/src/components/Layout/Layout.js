import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  // Detectar cambios de tamaño de pantalla para modo responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Función para alternar la visibilidad del sidebar
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="layout-container">
      <Sidebar 
        compact={isMobile} 
        visible={sidebarVisible} 
      />
      <div 
        className={`sidebar-toggle ${!sidebarVisible ? 'sidebar-hidden' : ''}`} 
        onClick={toggleSidebar}
      >
        {sidebarVisible ? '◀' : '▶'}
      </div>
      <main className={`layout-main ${!sidebarVisible ? 'sidebar-hidden' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;