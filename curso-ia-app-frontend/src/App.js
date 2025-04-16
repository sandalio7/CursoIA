import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout/Layout';
import AppRoutes from './routes/AppRoutes';
import ThemeDebug from './components/Layout/ThemeDebug';
import './styles/themes.css';

function App() {
  // Mostrar el componente de depuración solo en desarrollo
  const isDevMode = process.env.NODE_ENV === 'development';

  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <AppRoutes />
          
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;