// Dashboard.js - Főoldal komponens
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Dashboard = ({ gameState, setGameState, resetGame }) => {
  const [showWelcome, setShowWelcome] = useState(!gameState.playerName);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    const name = e.target.playerName.value;
    if (name.trim()) {
      setGameState(prev => ({
        ...prev,
        playerName: name.trim(),
        currentPhase: 'training'
      }));
      setShowWelcome(false);
    }
  };

  const getPhaseDescription = () => {
    const { unlockedModels, completedChallenges } = gameState;

    if (unlockedModels.length === 0) {
      return {
        title: "Küldetés I. fázis: Felkészülés",
        description: "Oldd fel az első modellt a selejt-felismeréshez!",
        status: "🎯 Aktív küldetés"
      };
    } else if (unlockedModels.length === 1) {
      return {
        title: "Küldetés II. fázis: Fejlesztés", 
        description: "Szerezd meg a regressziós modellt az előrejelzésekhez!",
        status: "⚡ Folyamatban"
      };
    } else if (completedChallenges.length < 2) {
      return {
        title: "Küldetés III. fázis: Küldetések",
        description: "Teljesítsd az eseménykártyák kihívásait!",
        status: "🚀 Haladó szint"
      };
    } else {
      return {
        title: "Küldetés IV. fázis: Prezentáció",
        description: "Készítsd el a végső megoldási tervet!",
        status: "🏆 Befejezés"
      };
    }
  };

  if (showWelcome) {
    return (
      <motion.div 
        className="welcome-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="welcome-content">
          <h2>🎯 Üdvözöl a Future-Tech Gyár!</h2>
          <div className="mission-briefing">
            <p>
              Tisztelt <strong>"Mintázatdekódoló"</strong> alakulat!
            </p>
            <p>
              A Future-Tech gyár MI-rendszere segítségre szorul. Rengeteg adat érkezik 
              a szenzorokból, de a rendszer nem tudja értelmezni őket. 
            </p>
            <p>
              <strong>A küldetésetek:</strong> Tanítsatok be egy gépi tanulási modellt, 
              amely felismeri a hibás termékeket és előrejelzi a termelési kapacitást.
            </p>
          </div>

          <form onSubmit={handleNameSubmit} className="name-form">
            <label htmlFor="playerName">Add meg a neved, Mintázatdekódoló:</label>
            <input 
              type="text" 
              id="playerName" 
              name="playerName" 
              placeholder="pl. Kovács Alex"
              required 
            />
            <button type="submit">🚀 Küldetés Indítása</button>
          </form>

          <div className="starting-resources">
            <h3>📋 Kezdő erőforrások:</h3>
            <div className="resource-item">
              <span>🪙 50 Tanulási Kredit (TK)</span>
            </div>
            <div className="resource-item">
              <span>📊 20 címkézett termék adata</span>
            </div>
            <div className="resource-item">
              <span>🎯 4 eseménykártya kihívás</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const phaseInfo = getPhaseDescription();

  return (
    <motion.div 
      className="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="dashboard-header">
        <h2>🏠 Küldetés Irányítópult</h2>
        <p>Üdv, <strong>{gameState.playerName}</strong>! 👋</p>
      </div>

      <div className="mission-status">
        <div className="status-card current-phase">
          <h3>{phaseInfo.title}</h3>
          <p>{phaseInfo.description}</p>
          <span className="status-badge">{phaseInfo.status}</span>
        </div>

        <div className="status-grid">
          <div className="stat-card">
            <div className="stat-icon">🪙</div>
            <div className="stat-content">
              <h4>Tanulási Kreditek</h4>
              <p className="stat-value">{gameState.credits} TK</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🧠</div>
            <div className="stat-content">
              <h4>Feloldott Modellek</h4>
              <p className="stat-value">{gameState.unlockedModels.length}/2</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h4>Teljesített Küldetések</h4>
              <p className="stat-value">{gameState.completedChallenges.length}/4</p>
            </div>
          </div>
        </div>
      </div>

      <div className="progress-section">
        <h3>📈 Küldetés Haladás</h3>
        <div className="progress-items">
          <div className={`progress-item \${gameState.unlockedModels.includes('classification') ? 'completed' : 'pending'}`}>
            ✅ Klasszifikációs modell feloldva
          </div>
          <div className={`progress-item \${gameState.unlockedModels.includes('regression') ? 'completed' : 'pending'}`}>
            🔬 Regressziós modell feloldva
          </div>
          <div className={`progress-item \${gameState.completedChallenges.length > 0 ? 'completed' : 'pending'}`}>
            🎯 Első eseménykártya teljesítve
          </div>
          <div className={`progress-item \${gameState.completedChallenges.length >= 4 ? 'completed' : 'pending'}`}>
            🏆 Összes küldetés befejezve
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>⚡ Gyors Műveletek</h3>
        <div className="action-buttons">
          {gameState.unlockedModels.length === 0 && (
            <button className="action-btn primary">
              🧠 Első Modell Feloldása
            </button>
          )}
          {gameState.unlockedModels.length === 1 && (
            <button className="action-btn secondary">
              🔬 Második Modell Feloldása
            </button>
          )}
          {gameState.unlockedModels.length === 2 && gameState.completedChallenges.length < 4 && (
            <button className="action-btn success">
              🎯 Küldetések Teljesítése
            </button>
          )}
          {gameState.completedChallenges.length >= 2 && (
            <button className="action-btn special">
              🎤 Prezentáció Készítése
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
