import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/api';
import './LeaderboardPage.css';

const LeaderboardPage = ({ backendConnected }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    if (!backendConnected) {
      setError('Backend kapcsolat megszakadt');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await getLeaderboard();
      setLeaderboard(response.data);
    } catch (error) {
      setError(error.message || 'Rangsor betöltése sikertelen');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (position) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${position}`;
    }
  };

  const getRankClass = (position) => {
    switch (position) {
      case 1: return 'gold';
      case 2: return 'silver';
      case 3: return 'bronze';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="leaderboard-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Rangsor betöltése...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-page">
      <div className="container">
        <div className="leaderboard-header">
          <h1 className="title-orbitron">🏆 Mintázatdekódolók Rangsora</h1>
          <p className="subtitle">A legjobb alakulatok teljesítménye</p>
          
          {!backendConnected && (
            <div className="alert alert-warning">
              ⚠️ Backend kapcsolat megszakadt - Az adatok elavultak lehetnek
            </div>
          )}
          
          {error && (
            <div className="alert alert-error">
              ❌ {error}
              <button onClick={loadLeaderboard} className="btn btn-sm btn-outline">
                Újrapróbálás
              </button>
            </div>
          )}
        </div>

        {leaderboard.length === 0 && !error ? (
          <div className="empty-state">
            <div className="empty-icon">🏁</div>
            <h2>Még nincsenek versenyzők</h2>
            <p>Legyél te az első, aki teljesíti a küldetést!</p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {leaderboard.length >= 3 && (
              <div className="podium-section">
                <div className="podium">
                  {/* 2nd Place */}
                  <div className="podium-place second">
                    <div className="podium-rank">🥈</div>
                    <div className="podium-info">
                      <div className="podium-name">{leaderboard[1].name}</div>
                      <div className="podium-team">{leaderboard[1].teamName}</div>
                      <div className="podium-score">{leaderboard[1].score} pont</div>
                    </div>
                  </div>

                  {/* 1st Place */}
                  <div className="podium-place first">
                    <div className="podium-rank">🥇</div>
                    <div className="podium-info">
                      <div className="podium-name">{leaderboard[0].name}</div>
                      <div className="podium-team">{leaderboard[0].teamName}</div>
                      <div className="podium-score">{leaderboard[0].score} pont</div>
                    </div>
                    <div className="podium-crown">👑</div>
                  </div>

                  {/* 3rd Place */}
                  <div className="podium-place third">
                    <div className="podium-rank">🥉</div>
                    <div className="podium-info">
                      <div className="podium-name">{leaderboard[2].name}</div>
                      <div className="podium-team">{leaderboard[2].teamName}</div>
                      <div className="podium-score">{leaderboard[2].score} pont</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Full Leaderboard */}
            <div className="leaderboard-section">
              <h2 className="subtitle-orbitron">📊 Teljes Rangsor</h2>
              
              <div className="leaderboard-table">
                <div className="table-header">
                  <div className="header-cell rank-col">Helyezés</div>
                  <div className="header-cell player-col">Dekódoló</div>
                  <div className="header-cell team-col">Alakulat</div>
                  <div className="header-cell stats-col">Teljesítmény</div>
                  <div className="header-cell score-col">Pontszám</div>
                </div>

                <div className="table-body">
                  {leaderboard.map((player, index) => (
                    <div 
                      key={player.userId} 
                      className={`table-row ${getRankClass(index + 1)}`}
                    >
                      <div className="table-cell rank-col">
                        <span className="rank-badge">
                          {getRankIcon(index + 1)}
                        </span>
                      </div>
                      
                      <div className="table-cell player-col">
                        <div className="player-info">
                          <span className="player-name">{player.name}</span>
                          <span className="player-phase">{player.currentPhase}</span>
                        </div>
                      </div>
                      
                      <div className="table-cell team-col">
                        <span className="team-name">{player.teamName}</span>
                      </div>
                      
                      <div className="table-cell stats-col">
                        <div className="stats-grid">
                          <div className="stat-item">
                            <span className="stat-value">{player.credits}</span>
                            <span className="stat-label">TK</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-value">{player.modelsUnlocked}</span>
                            <span className="stat-label">Modellek</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-value">{player.challengesCompleted}</span>
                            <span className="stat-label">Kihívások</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="table-cell score-col">
                        <span className="total-score">{player.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="stats-section">
              <h2 className="subtitle-orbitron">📈 Verseny Statisztikák</h2>
              <div className="stats-cards">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <span className="stat-number">{leaderboard.length}</span>
                    <span className="stat-title">Résztvevő</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">🎯</div>
                  <div className="stat-info">
                    <span className="stat-number">
                      {leaderboard.filter(p => p.modelsUnlocked === 2).length}
                    </span>
                    <span className="stat-title">Teljes Modell</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">🏅</div>
                  <div className="stat-info">
                    <span className="stat-number">
                      {leaderboard.filter(p => p.challengesCompleted === 4).length}
                    </span>
                    <span className="stat-title">Minden Kihívás</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">⚡</div>
                  <div className="stat-info">
                    <span className="stat-number">
                      {leaderboard.length > 0 ? Math.round(leaderboard.reduce((sum, p) => sum + p.credits, 0) / leaderboard.length) : 0}
                    </span>
                    <span className="stat-title">Átlag TK</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
