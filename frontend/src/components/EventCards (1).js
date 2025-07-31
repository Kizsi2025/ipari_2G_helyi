// EventCards.js - Eseménykártyák komponens
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { eventCards, getRandomEventCard } from '../data/eventCards';

const EventCards = ({ gameState, completeChallenge }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [completedCards, setCompletedCards] = useState([]);

  const canAccessEvents = gameState.unlockedModels.includes('classification');
  const hasRegressionModel = gameState.unlockedModels.includes('regression');

  const handleCardSelect = (card) => {
    setSelectedCard(card);
    setShowCardDetails(true);
  };

  const handleChallengeComplete = (cardId) => {
    if (!hasRegressionModel) {
      alert('Előbb fel kell oldanod a Regressziós modellt ennek a küldetésnek a teljesítéséhez!');
      return;
    }

    if (gameState.credits < 10) {
      alert('Nincs elegendő Tanulási Kredited a küldetés teljesítéséhez! (10 TK szükséges)');
      return;
    }

    // Szimuláljuk a küldetés teljesítését
    completeChallenge(cardId, 5); // 5 bonus kredit a teljesítésért
    setCompletedCards(prev => [...prev, cardId]);
    setSelectedCard(null);
    setShowCardDetails(false);

    // Sikeres teljesítés üzenet
    alert(`🎉 Küldetés teljesítve! +5 bonus TK a kiváló munkáért!`);
  };

  const EventCard = ({ card, isCompleted }) => (
    <motion.div
      className={`event-card \${isCompleted ? 'completed' : ''}`}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => !isCompleted && handleCardSelect(card)}
    >
      <div className="card-header">
        <div className="card-icon">{card.icon}</div>
        <div className={`difficulty-badge \${card.difficulty}`}>
          {card.difficulty === 'easy' && '⭐'}
          {card.difficulty === 'medium' && '⭐⭐'}
          {card.difficulty === 'hard' && '⭐⭐⭐'}
        </div>
      </div>

      <div className="card-content">
        <h3>{card.title}</h3>
        <p className="card-message">{card.message.substring(0, 120)}...</p>

        <div className="card-requirements">
          <span className="req-cost">💰 {card.cost} TK</span>
          <span className="req-model">🧠 Regressziós modell</span>
        </div>
      </div>

      <div className="card-footer">
        {isCompleted ? (
          <span className="completed-badge">✅ Teljesítve</span>
        ) : (
          <button className="card-btn">
            📖 Részletek megtekintése
          </button>
        )}
      </div>
    </motion.div>
  );

  const CardDetailsModal = ({ card }) => (
    <AnimatePresence>
      {showCardDetails && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowCardDetails(false)}
        >
          <motion.div
            className="card-details-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{card.icon} {card.title}</h2>
              <button 
                className="close-btn"
                onClick={() => setShowCardDetails(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-content">
              <div className="leadership-message">
                <h3>📢 Üzenet a vezetőségtől:</h3>
                <div className="message-box">
                  <p>"{card.message}"</p>
                </div>
              </div>

              <div className="challenge-task">
                <h3>🎯 Feladat:</h3>
                <div className="task-box">
                  <p>{card.task}</p>
                </div>
              </div>

              <div className="requirements-section">
                <h3>📋 Követelmények:</h3>
                <div className="requirements-list">
                  <div className={`requirement \${hasRegressionModel ? 'met' : 'unmet'}`}>
                    {hasRegressionModel ? '✅' : '❌'} Regressziós modell
                  </div>
                  <div className={`requirement \${gameState.credits >= card.cost ? 'met' : 'unmet'}`}>
                    {gameState.credits >= card.cost ? '✅' : '❌'} {card.cost} Tanulási Kredit
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => setShowCardDetails(false)}
              >
                🚫 Mégsem
              </button>

              {hasRegressionModel && gameState.credits >= card.cost ? (
                <button 
                  className="btn-complete"
                  onClick={() => handleChallengeComplete(card.id)}
                >
                  🚀 Küldetés Teljesítése (-{card.cost} TK)
                </button>
              ) : (
                <button className="btn-disabled" disabled>
                  🔒 Nem teljesíthető
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!canAccessEvents) {
    return (
      <div className="event-cards locked-section">
        <div className="locked-message">
          <h2>🔒 Eseménykártyák Zárva</h2>
          <p>
            Az eseménykártyák eléréséhez előbb fel kell oldanod a 
            <strong> Klasszifikációs modellt</strong>!
          </p>
          <p>
            Menj a "Modellek" fülre és kezdd el a fejlesztést 15 TK befektetésével.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="event-cards"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="page-header">
        <h2>🎯 Eseménykártyák - Küldetések</h2>
        <p>Teljesítsd a vezetőség kihívásait és szerezz extra krediteket!</p>
      </div>

      <div className="mission-status">
        <div className="status-info">
          <div className="status-item">
            <span>📊 Teljesített küldetések:</span>
            <span className="status-value">{completedCards.length + gameState.completedChallenges.length}/4</span>
          </div>
          <div className="status-item">
            <span>🪙 Elérhető kreditek:</span>
            <span className="status-value">{gameState.credits} TK</span>
          </div>
          <div className="status-item">
            <span>🧠 Szükséges modell:</span>
            <span className={`status-value \${hasRegressionModel ? 'ready' : 'missing'}`}>
              {hasRegressionModel ? '✅ Regressziós' : '❌ Regressziós'}
            </span>
          </div>
        </div>
      </div>

      {!hasRegressionModel && (
        <div className="warning-banner">
          <h3>⚠️ Figyelem!</h3>
          <p>
            Az eseménykártyák teljesítéséhez szükséged lesz a <strong>Regressziós modellre</strong>. 
            Menj a "Modellek" fülre és old fel 15 TK-ért!
          </p>
        </div>
      )}

      <div className="cards-grid">
        {eventCards.map(card => (
          <EventCard 
            key={card.id} 
            card={card} 
            isCompleted={completedCards.includes(card.id) || gameState.completedChallenges.includes(card.id)}
          />
        ))}
      </div>

      <div className="strategy-tips">
        <h3>💡 Stratégiai Tippek</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <h4>🎯 Prioritás</h4>
            <p>Először oldd fel mindkét modellt, aztán tégy küldetéseket!</p>
          </div>
          <div className="tip-card">
            <h4>💰 Költségvetés</h4>
            <p>Minden küldetés 10 TK-ba kerül, de +5 TK bonuszt ad!</p>
          </div>
          <div className="tip-card">
            <h4>🏆 Cél</h4>
            <p>Legalább 2 küldetést teljesíts a prezentációhoz!</p>
          </div>
        </div>
      </div>

      {selectedCard && <CardDetailsModal card={selectedCard} />}
    </motion.div>
  );
};

export default EventCards;
