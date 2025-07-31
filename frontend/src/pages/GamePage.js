import React, { useState, useEffect } from 'react';
import { getGameState, unlockModel, completeChallenge, getProducts, getEventCards } from '../services/api';
import './GamePage.css';

const GamePage = ({ user }) => {
  const [gameState, setGameState] = useState(null);
  const [products, setProducts] = useState([]);
  const [eventCards, setEventCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedEventCard, setSelectedEventCard] = useState(null);

  useEffect(() => {
    loadGameData();
  }, [user.id]);

  const loadGameData = async () => {
    try {
      setLoading(true);
      const [gameResponse, productsResponse, cardsResponse] = await Promise.all([
        getGameState(user.id),
        getProducts(),
        getEventCards()
      ]);

      setGameState(gameResponse.data);
      setProducts(productsResponse.data);
      setEventCards(cardsResponse.data);
    } catch (error) {
      setError(error.message || 'Adatok betöltése sikertelen');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockModel = async (modelType) => {
    try {
      setActionLoading(true);
      const response = await unlockModel(user.id, modelType);
      setGameState(prevState => ({
        ...prevState,
        credits: response.data.remainingCredits,
        unlockedModels: response.data.unlockedModels,
        currentPhase: response.data.currentPhase
      }));
    } catch (error) {
      setError(error.message || 'Modell feloldása sikertelen');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteChallenge = async (challengeId) => {
    try {
      setActionLoading(true);
      const response = await completeChallenge(user.id, challengeId);
      setGameState(prevState => ({
        ...prevState,
        credits: response.data.remainingCredits,
        completedChallenges: response.data.completedChallenges,
        currentPhase: response.data.currentPhase
      }));
      setSelectedEventCard(null);
    } catch (error) {
      setError(error.message || 'Kihívás teljesítése sikertelen');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="game-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Küldetés adatok betöltése...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-page">
        <div className="container">
          <div className="error-state">
            <h2>❌ Hiba történt</h2>
            <p>{error}</p>
            <button onClick={loadGameData} className="btn btn-primary">
              Újrapróbálás
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-page">
      <div className="container">
        {/* Game Header */}
        <div className="game-header">
          <div className="player-info">
            <h1 className="title-orbitron">Küldetés Irányítópult</h1>
            <p className="subtitle">Dekódoló: {user.name} | Alakulat: {user.teamName}</p>
          </div>
          
          <div className="credits-display">
            <div className="credits-badge">
              <span className="credits-icon">⚡</span>
              <span className="credits-value">{gameState?.credits || 0}</span>
              <span className="credits-label">TK</span>
            </div>
          </div>
        </div>

        {/* Game Progress */}
        <div className="game-progress">
          <div className="progress-item">
            <div className="progress-icon">
              {gameState?.unlockedModels?.includes('classification') ? '✅' : '🔒'}
            </div>
            <div className="progress-info">
              <h3>Klasszifikációs Modell</h3>
              <p>Selejt-felismerés automatizálása</p>
            </div>
            <div className="progress-action">
              {!gameState?.unlockedModels?.includes('classification') ? (
                <button 
                  onClick={() => handleUnlockModel('classification')}
                  className="btn btn-primary"
                  disabled={actionLoading || gameState?.credits < 15}
                >
                  Feloldás (-15 TK)
                </button>
              ) : (
                <span className="status-badge success">Aktív</span>
              )}
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-icon">
              {gameState?.unlockedModels?.includes('regression') ? '✅' : '🔒'}
            </div>
            <div className="progress-info">
              <h3>Regressziós Modell</h3>
              <p>Termelési előrejelzés</p>
            </div>
            <div className="progress-action">
              {!gameState?.unlockedModels?.includes('regression') ? (
                <button 
                  onClick={() => handleUnlockModel('regression')}
                  className="btn btn-primary"
                  disabled={actionLoading || gameState?.credits < 15}
                >
                  Feloldás (-15 TK)
                </button>
              ) : (
                <span className="status-badge success">Aktív</span>
              )}
            </div>
          </div>
        </div>

        {/* Data Analysis Section */}
        {gameState?.unlockedModels?.includes('classification') && (
          <div className="data-section">
            <h2 className="subtitle-orbitron">📊 Címkézett Adatcsomag Elemzése</h2>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Termék ID</th>
                    <th>Súly (g)</th>
                    <th>Színkód</th>
                    <th>Méret</th>
                    <th>Kategória</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 10).map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.weight}</td>
                      <td>
                        <span className={`color-badge ${product.color.toLowerCase()}`}>
                          {product.color}
                        </span>
                      </td>
                      <td>{product.size}</td>
                      <td>
                        <span className={`category-badge ${product.category === 'Megfelelő' ? 'success' : 'danger'}`}>
                          {product.category === 'Megfelelő' ? '✅' : '❌'}
                          {product.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Event Cards Section */}
        {gameState?.unlockedModels?.length > 0 && (
          <div className="events-section">
            <h2 className="subtitle-orbitron">📬 Eseménykártyák</h2>
            <div className="event-cards-grid">
              {eventCards.map((card) => (
                <div 
                  key={card.id} 
                  className={`event-card card ${gameState?.completedChallenges?.includes(card.id) ? 'completed' : ''}`}
                >
                  <div className="card-header">
                    <h3>{card.title}</h3>
                    <span className={`difficulty-badge ${card.difficulty}`}>
                      {card.difficulty}
                    </span>
                  </div>
                  
                  <div className="card-content">
                    <p>{card.message}</p>
                    <div className="card-task">
                      <strong>Feladat:</strong> {card.task}
                    </div>
                  </div>
                  
                  <div className="card-footer">
                    {gameState?.completedChallenges?.includes(card.id) ? (
                      <span className="status-badge success">✅ Teljesítve</span>
                    ) : (
                      <button
                        onClick={() => handleCompleteChallenge(card.id)}
                        className="btn btn-success"
                        disabled={actionLoading || gameState?.credits < card.cost}
                      >
                        Teljesítés (-{card.cost} TK)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game Status */}
        <div className="game-status">
          <div className="status-item">
            <span className="status-label">Jelenlegi Fázis:</span>
            <span className="status-value">{gameState?.currentPhase || 'Kezdés'}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Feloldott Modellek:</span>
            <span className="status-value">{gameState?.unlockedModels?.length || 0}/2</span>
          </div>
          <div className="status-item">
            <span className="status-label">Teljesített Kihívások:</span>
            <span className="status-value">{gameState?.completedChallenges?.length || 0}/4</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
