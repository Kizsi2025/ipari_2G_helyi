import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import './HomePage.css';

const HomePage = ({ user, onUserLogin, backendConnected }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    teamName: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!backendConnected) {
      setError('Backend nem elérhető');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await registerUser(formData);
      onUserLogin(response.data.user);
    } catch (error) {
      setError(error.message || 'Regisztráció sikertelen');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="home-page">
        <div className="container">
          <div className="welcome-section">
            <div className="welcome-header">
              <h1 className="title-orbitron">Üdvözöljük, {user.name}!</h1>
              <p className="subtitle">Csapat: {user.teamName}</p>
            </div>

            <div className="mission-brief">
              <div className="brief-card card">
                <h2 className="subtitle-orbitron">🎯 A Küldetés</h2>
                <p>
                  A Future-Tech gyár MI-rendszere segítségre szorul! 
                  Az adatok özönlenek, de a rendszer nem érti őket. 
                  A feladatod, hogy betaníts egy modellt, amely képes 
                  különbséget tenni a jó és a selejtes termékek között.
                </p>
                
                <div className="mission-stats">
                  <div className="stat-item">
                    <span className="stat-value">50</span>
                    <span className="stat-label">Kezdő TK</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">2</span>
                    <span className="stat-label">MI Modell</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">4</span>
                    <span className="stat-label">Kihívás</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <Link to="/game" className="btn btn-primary btn-lg">
                🚀 Küldetés Indítása
              </Link>
              <Link to="/leaderboard" className="btn btn-outline btn-lg">
                🏆 Rangsor Megtekintése
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="container">
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-header">
              <h1 className="hero-title title-orbitron">
                Future-Tech
                <span className="title-accent">MI Küldetés</span>
              </h1>
              <p className="hero-subtitle">
                Gamifikált gépi tanulás oktatási platform
              </p>
            </div>

            <div className="hero-features">
              <div className="feature-item">
                <span className="feature-icon">🏭</span>
                <span>Ipari MI Szimuláció</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎮</span>
                <span>Gamifikált Tanulás</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🏆</span>
                <span>Verseny & Rangsor</span>
              </div>
            </div>
          </div>

          <div className="hero-form">
            {!isRegistering ? (
              <div className="welcome-card card">
                <h2 className="subtitle-orbitron">Készen állsz a kihívásra?</h2>
                <p>
                  Csatlakozz a Mintázatdekódoló alakulatokhoz és tanítsd meg 
                  a Future-Tech gyár MI-rendszerét!
                </p>
                
                {!backendConnected && (
                  <div className="alert alert-warning">
                    ⚠️ Backend kapcsolat megszakadt
                  </div>
                )}
                
                <button 
                  onClick={() => setIsRegistering(true)}
                  className="btn btn-primary btn-lg"
                  disabled={!backendConnected}
                >
                  🚀 Regisztráció & Indítás
                </button>
              </div>
            ) : (
              <div className="register-card card">
                <h2 className="subtitle-orbitron">Alakulat Regisztráció</h2>
                
                {error && (
                  <div className="alert alert-error">
                    ❌ {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Dekódoló neve</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Add meg a nevedet"
                      required
                      maxLength={50}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Alakulat neve</label>
                    <input
                      type="text"
                      name="teamName"
                      value={formData.teamName}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Csapat neve (pl. Alpha Dekódolók)"
                      required
                      maxLength={50}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email (opcionális)</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="btn btn-success"
                      disabled={loading || !backendConnected}
                    >
                      {loading ? (
                        <>
                          <span className="spinner"></span>
                          Regisztráció...
                        </>
                      ) : (
                        '✅ Küldetés Elfogadása'
                      )}
                    </button>
                    
                    <button 
                      type="button"
                      onClick={() => setIsRegistering(false)}
                      className="btn btn-outline"
                      disabled={loading}
                    >
                      Vissza
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
