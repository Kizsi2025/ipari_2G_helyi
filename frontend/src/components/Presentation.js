// Presentation.js - Prezentáció komponens
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Presentation = ({ gameState }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [presentationMode, setPresentationMode] = useState(false);
  const [customPresentation, setCustomPresentation] = useState({
    teamName: gameState.teamName || 'Mintázatdekódolók',
    classification: '',
    regression: '',
    synergy: '',
    results: ''
  });

  const canAccessPresentation = gameState.completedChallenges.length >= 1 || 
                               gameState.unlockedModels.length >= 2;

  // Minta prezentáció a PDF alapján
  const sampleSlides = [
    {
      id: 1,
      title: "Az Alpha dekódolók jelentése",
      content: `Tisztelt Vezetőség, tisztelt Mentor! Az ${gameState.teamName || 'Alpha dekódolók'} nevében jelentem: a küldetést teljesítettük. A 'Future-Tech' gyár adathalmazában rejlő mintázatokat sikeresen dekódoltuk, és egy olyan kettős hatékonyságú MI-rendszert terveztünk, amely nemcsak a jelen problémáit orvosolja, hanem a jövőt is tervezi.`,
      type: "intro"
    },
    {
      id: 2,
      title: "1. pont: A Klasszifikációs megoldás",
      content: `Első lépésként a minőség-ellenőrzést forradalmasítjuk. Az általunk fejlesztett 'Sólyomszem' Klasszifikációs modell valós időben, a gyártósori szenzorok (súly, hőmérséklet, méret) adatai alapján azonosítja a selejtes termékeket. A rendszer nem hibázik, és automatikusan kiválogatja a hibás darabokat.

• Eredmény: A selejt azonnali kiszűrése, a veszteségek minimalizálása és 100%-os minőségi garancia.`,
      type: "classification"
    },
    {
      id: 3,
      title: "2. pont: A regressziós megoldás",
      content: `De nem álltunk meg itt. Az Önök kérésére a jövőbe is tekintettünk. A 'Kristálygömb' Regressziós modellünk a historikus termelési adatok, a gépállapotok és a megrendelések alapján képes pontosan előre jelezni a következő hét várható termelési volumenét.

• Eredmény: Nincs többé alapanyaghiány vagy kihasználatlan kapacitás. A beszerzés és a munkaerő-tervezés adatalapúvá és ultrahatékonnyá válik.`,
      type: "regression"
    },
    {
      id: 4,
      title: "3. pont: A szinergia és a javaslat",
      content: `A két modell igazi ereje azonban az együttműködésükben rejlik. A 'Kristálygömb' megmondja, hogy a gyár mennyit fog termelni – mondjuk 10 000 darabot. A 'Sólyomszem' pedig a historikus adatok alapján megbecsüli a várható selejt arányát – például 2%-ot.

MI Javaslatunk: A két adatot kombinálva Önök nemcsak egy bruttó termelési számmal, hanem a piacra bocsátható, nettó, hibátlan termékek pontos darabszámával (9 800 darab) tervezhetnek. Ez a pontosság a piacon behozhatatlan versenyelőnyt jelent.`,
      type: "synergy"
    },
    {
      id: 5,
      title: "4. pont: Zárszó",
      content: `Tisztelt Vezetőség! A mi tervünkkel a 'Future-Tech' a reaktív hibakezelésről a proaktív, prediktív működésre áll át. A fejlesztést hatékonyan, ${gameState.credits} Tanulási kredit megőrzésével hajtottuk végre. Készen állunk az implementációra. Köszönjük a figyelmet!`,
      type: "conclusion"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sampleSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sampleSlides.length) % sampleSlides.length);
  };

  const PresentationSlide = ({ slide, isActive }) => (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={slide.id}
          className={`presentation-slide \${slide.type}`}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          <div className="slide-header">
            <h2>{slide.title}</h2>
            <div className="slide-number">
              {slide.id}/{sampleSlides.length}
            </div>
          </div>

          <div className="slide-content">
            {slide.content.split('\n').map((paragraph, index) => {
              if (paragraph.trim().startsWith('•')) {
                return (
                  <div key={index} className="bullet-point">
                    {paragraph.trim()}
                  </div>
                );
              }
              return (
                <p key={index} className="slide-paragraph">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const PresentationControls = () => (
    <div className="presentation-controls">
      <button onClick={prevSlide} disabled={currentSlide === 0}>
        ⬅️ Előző
      </button>

      <div className="slide-indicators">
        {sampleSlides.map((_, index) => (
          <button
            key={index}
            className={`indicator \${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <button onClick={nextSlide} disabled={currentSlide === sampleSlides.length - 1}>
        Következő ➡️
      </button>
    </div>
  );

  const GameStats = () => (
    <div className="final-stats">
      <h3>🏆 Küldetés Statisztikák</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Megmaradt kreditek:</span>
          <span className="stat-value">{gameState.credits} TK</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Feloldott modellek:</span>
          <span className="stat-value">{gameState.unlockedModels.length}/2</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Teljesített küldetések:</span>
          <span className="stat-value">{gameState.completedChallenges.length}/4</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Küldetés hatékonyság:</span>
          <span className="stat-value">
            {gameState.unlockedModels.length === 2 && gameState.completedChallenges.length >= 2 
              ? 'Kiváló' 
              : gameState.unlockedModels.length >= 1 
                ? 'Jó' 
                : 'Folyamatban'
            }
          </span>
        </div>
      </div>
    </div>
  );

  if (!canAccessPresentation) {
    return (
      <div className="presentation locked-section">
        <div className="locked-message">
          <h2>🔒 Prezentáció Zárva</h2>
          <p>
            A prezentáció elkészítéséhez legalább <strong>1 küldetést teljesítened</strong> kell, 
            vagy <strong>mindkét modellt fel kell oldanod</strong>!
          </p>
          <div className="requirements-list">
            <div className={`requirement \${gameState.unlockedModels.length >= 2 ? 'met' : 'unmet'}`}>
              {gameState.unlockedModels.length >= 2 ? '✅' : '❌'} Mindkét modell feloldva ({gameState.unlockedModels.length}/2)
            </div>
            <div className={`requirement \${gameState.completedChallenges.length >= 1 ? 'met' : 'unmet'}`}>
              {gameState.completedChallenges.length >= 1 ? '✅' : '❌'} Legalább 1 küldetés teljesítve ({gameState.completedChallenges.length}/4)
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="page-header">
        <h2>🎤 Prezentáció a Vezetőségnek</h2>
        <p>Mutasd be a megoldási terved 2 perces pitch formájában!</p>
      </div>

      <GameStats />

      <div className="presentation-modes">
        <div className="mode-selector">
          <button 
            className={`mode-btn \${!presentationMode ? 'active' : ''}`}
            onClick={() => setPresentationMode(false)}
          >
            📖 Felkészülés
          </button>
          <button 
            className={`mode-btn \${presentationMode ? 'active' : ''}`}
            onClick={() => setPresentationMode(true)}
          >
            🎭 Prezentáció mód
          </button>
        </div>
      </div>

      {!presentationMode ? (
        <div className="preparation-mode">
          <div className="presentation-preview">
            <h3>📋 Minta Prezentáció Előnézet</h3>
            <p>Böngészd át a diákat és készülj fel a prezentációra!</p>

            <div className="slide-container">
              <PresentationSlide 
                slide={sampleSlides[currentSlide]} 
                isActive={true}
              />
            </div>

            <PresentationControls />
          </div>

          <div className="preparation-tips">
            <h3>💡 Prezentációs Tippek</h3>
            <div className="tips-list">
              <div className="tip-item">
                <span className="tip-icon">⏱️</span>
                <span>2 perc az időkeret - gyakorold az időzítést!</span>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🎯</span>
                <span>Hangsúlyozd a két modell együttes erejét!</span>
              </div>
              <div className="tip-item">
                <span className="tip-icon">💼</span>
                <span>Konkrét üzleti értéket mutass be!</span>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🏆</span>
                <span>Zárj magabiztosan - kérj döntést!</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="presentation-mode">
          <div className="fullscreen-presentation">
            <div className="presentation-header">
              <h1>🏭 Future-Tech MI Küldetés</h1>
              <h2>A {gameState.teamName} Prezentációja</h2>
            </div>

            <div className="main-slide">
              <PresentationSlide 
                slide={sampleSlides[currentSlide]} 
                isActive={true}
              />
            </div>

            <div className="presentation-footer">
              <PresentationControls />
              <button 
                className="exit-presentation"
                onClick={() => setPresentationMode(false)}
              >
                🚪 Kilépés
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="completion-celebration">
        {gameState.unlockedModels.length === 2 && gameState.completedChallenges.length >= 2 && (
          <motion.div
            className="success-message"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h3>🎉 Gratulálunk!</h3>
            <p>
              Sikeresen teljesítetted a Future-Tech MI Küldetést! 
              Feloldottad mindkét modellt és teljesítettél több küldetést is.
            </p>
            <div className="achievement-badge">
              🏆 Mintázatdekódolók Bajnoka
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Presentation;
