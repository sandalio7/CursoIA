import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Intenta obtener el tema guardado en localStorage o usa 'dark' como predeterminado
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });

  // Efecto para aplicar la clase al elemento html cuando cambia el tema
  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`${theme}-theme`);
    
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