import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-container">
        {/* Logo */}
        <div className="loading-logo">
          <span className="logo-icon pulse">🏭</span>
          <h1 className="title-orbitron">Future-Tech</h1>
          <p className="subtitle">MI Küldetés betöltése...</p>
        </div>

        {/* Progress Bar */}
        <div className="loading-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <div className="progress-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>

        {/* Loading Messages */}
        <div className="loading-message">
          <p>Rendszerek inicializálása...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
