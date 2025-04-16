import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './Layout.css';
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  // No mostrar el sidebar en la página de creación de curso o en la página de inicio
  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  const shouldShowSidebar = !isHomePage && !location.pathname.includes('/create') && !location.pathname.includes('/login') && !location.pathname.includes('/register');
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Si es la página principal, no aplicar el layout
  if (isHomePage) {
    return children;
  }
  
  return (
    <div className="app-container">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="main-container">
        {shouldShowSidebar && (
          <div className={`sidebar-container ${sidebarOpen ? 'open' : 'closed'}`}>
            <Sidebar />
          </div>
        )}
        
        <div className={`content-container ${shouldShowSidebar && sidebarOpen ? 'with-sidebar' : 'full-width'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};
export default Layout;