import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Intenta obtener el tema guardado en localStorage o usa 'light' como predeterminado
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Efecto para aplicar la clase al elemento html cuando cambia el tema
  useEffect(() => {
    document.documentElement.className = '';
    document.documentElement.classList.add(theme === 'dark' ? 'dark-theme' : 'light-theme');
    
    // Guarda la preferencia en localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Función para alternar entre temas
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};