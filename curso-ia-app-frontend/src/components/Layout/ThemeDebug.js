import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const ThemeDebug = () => {
  const { theme } = useContext(ThemeContext);
  
  // Obtener variables CSS actuales
  const getComputedStyle = () => {
    const styles = window.getComputedStyle(document.documentElement);
    return {
      bgPrimary: styles.getPropertyValue('--bg-primary'),
      bgCard: styles.getPropertyValue('--bg-card'),
      bgSidebar: styles.getPropertyValue('--bg-sidebar'),
      textTitle: styles.getPropertyValue('--text-title'),
      textPrimary: styles.getPropertyValue('--text-primary'),
      accentColor: styles.getPropertyValue('--accent-color'),
      bodyClasses: document.documentElement.className
    };
  };
  
  const computedStyles = getComputedStyle();

  return (
    <div className="theme-debug">
      <p>Tema actual: {theme}</p>
      <p>Clases HTML: {computedStyles.bodyClasses}</p>
      <div style={{ marginTop: '10px' }}>
        <div style={{ display: 'flex', marginBottom: '5px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: computedStyles.bgPrimary, marginRight: '5px' }}></div>
          <span>--bg-primary: {computedStyles.bgPrimary}</span>
        </div>
        <div style={{ display: 'flex', marginBottom: '5px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: computedStyles.bgCard, marginRight: '5px' }}></div>
          <span>--bg-card: {computedStyles.bgCard}</span>
        </div>
        <div style={{ display: 'flex', marginBottom: '5px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: computedStyles.bgSidebar, marginRight: '5px' }}></div>
          <span>--bg-sidebar: {computedStyles.bgSidebar}</span>
        </div>
        <div style={{ display: 'flex', marginBottom: '5px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: computedStyles.textTitle, marginRight: '5px' }}></div>
          <span>--text-title: {computedStyles.textTitle}</span>
        </div>
        <div style={{ display: 'flex', marginBottom: '5px' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: computedStyles.accentColor, marginRight: '5px' }}></div>
          <span>--accent-color: {computedStyles.accentColor}</span>
        </div>
      </div>
    </div>
  );
};

export default ThemeDebug;