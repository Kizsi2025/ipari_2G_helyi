// App.js - Future-Tech MI Küldetés fő komponens
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ModelUnlock from './components/ModelUnlock';
import EventCards from './components/EventCards';
import DataAnalysis from './components/DataAnalysis';
import Presentation from './components/Presentation';
import './styles/App.css';

const App = () => {
  // Játék állapot kezelése
  const [gameState, setGameState] = useState({
    credits: 50, // Kezdő Tanulási kreditek (TK)
    unlockedModels: [], // Feloldott modellek
    completedChallenges: [], // Teljesített kihívások
    currentPhase: 'start', // Jelenlegi fázis
    playerName: '',
    teamName: 'Mintázatdekódolók'
  });

  const [currentView, setCurrentView] = useState('dashboard');

  // LocalStorage mentés és betöltés
  useEffect(() => {
    const savedState = localStorage.getItem('futuretech-gamestate');
    if (savedState) {
      setGameState(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('futuretech-gamestate', JSON.stringify(gameState));
  }, [gameState]);

  // Modell feloldása
  const unlockModel = (modelType, cost) => {
    if (gameState.credits >= cost && !gameState.unlockedModels.includes(modelType)) {
      setGameState(prev => ({
        ...prev,
        credits: prev.credits - cost,
        unlockedModels: [...prev.unlockedModels, modelType]
      }));
      return true;
    }
    return false;
  };

  // Kihívás teljesítése
  const completeChallenge = (challengeId, reward = 0) => {
    if (!gameState.completedChallenges.includes(challengeId)) {
      setGameState(prev => ({
        ...prev,
        completedChallenges: [...prev.completedChallenges, challengeId],
        credits: prev.credits + reward
      }));
    }
  };

  // Játék újraindítása
  const resetGame = () => {
    setGameState({
      credits: 50,
      unlockedModels: [],
      completedChallenges: [],
      currentPhase: 'start',
      playerName: '',
      teamName: 'Mintázatdekódolók'
    });
    localStorage.removeItem('futuretech-gamestate');
  };

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <div className="logo">
              <h1>🏭 Future-Tech MI Küldetés</h1>
              <p>Mintázatdekódolók Akadémia</p>
            </div>
            <div className="game-stats">
              <div className="credit-display">
                <span className="credit-icon">🪙</span>
                <span className="credit-amount">{gameState.credits} TK</span>
              </div>
              <div className="team-info">
                <span>👥 {gameState.teamName}</span>
              </div>
            </div>
          </div>
        </header>

        <nav className="app-nav">
          <button 
            className={`nav-btn \${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            🏠 Irányítópult
          </button>
          <button 
            className={`nav-btn \${currentView === 'models' ? 'active' : ''}`}
            onClick={() => setCurrentView('models')}
          >
            🧠 Modellek
          </button>
          <button 
            className={`nav-btn \${currentView === 'events' ? 'active' : ''}`}
            onClick={() => setCurrentView('events')}
          >
            🎯 Küldetések
          </button>
          <button 
            className={`nav-btn \${currentView === 'data' ? 'active' : ''}`}
            onClick={() => setCurrentView('data')}
          >
            📊 Adatelemzés
          </button>
          <button 
            className={`nav-btn \${currentView === 'presentation' ? 'active' : ''}`}
            onClick={() => setCurrentView('presentation')}
          >
            🎤 Prezentáció
          </button>
        </nav>

        <main className="app-main">
          {currentView === 'dashboard' && (
            <Dashboard 
              gameState={gameState}
              setGameState={setGameState}
              resetGame={resetGame}
            />
          )}
          {currentView === 'models' && (
            <ModelUnlock 
              gameState={gameState}
              unlockModel={unlockModel}
            />
          )}
          {currentView === 'events' && (
            <EventCards 
              gameState={gameState}
              completeChallenge={completeChallenge}
            />
          )}
          {currentView === 'data' && (
            <DataAnalysis 
              gameState={gameState}
            />
          )}
          {currentView === 'presentation' && (
            <Presentation 
              gameState={gameState}
            />
          )}
        </main>

        <footer className="app-footer">
          <p>© 2025 Future-Tech Gyártósor | Gamifikált MI Oktatás</p>
          <button className="reset-btn" onClick={resetGame}>
            🔄 Újraindítás
          </button>
        </footer>
      </div>
    </Router>
  );
};

export default App;
