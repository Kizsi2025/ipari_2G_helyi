// ModelUnlock.js - Modell feloldás komponens
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ModelUnlock = ({ gameState, unlockModel }) => {
  const [selectedModel, setSelectedModel] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const models = [
    {
      id: 'classification',
      name: 'Klasszifikációs Modell',
      cost: 15,
      icon: '🎯',
      description: 'A "Sólyomszem" - Automatikus selejt-felismerő rendszer',
      features: [
        'Valós idejű termék kategorizálás',
        'Megfelelő/Selejt besorolás',
        'Szenzoradatok elemzése',
        'Automatikus szétválogatás'
      ],
      applicationArea: 'Minőségbiztosítás és hibakezelés',
      example: 'Kamera alapú vizsgálat: egy termék lefotózása után azonnal megállapítja, hogy megfelelő-e vagy selejtes.',
      unlocked: gameState.unlockedModels.includes('classification')
    },
    {
      id: 'regression',
      name: 'Regressziós Modell', 
      cost: 15,
      icon: '📈',
      description: 'A "Kristálygömb" - Numerikus előrejelző rendszer',
      features: [
        'Termelési mennyiség becslése',
        'Energiafogyasztás előrejelzés',
        'Alkatrész élettartam számítás',
        'Kapacitástervezés támogatás'
      ],
      applicationArea: 'Termelésirányítás és optimalizálás',
      example: 'Historikus adatok alapján pontosan megjósolja, hogy a jövő héten hány darab terméket fog gyártani a gyár.',
      unlocked: gameState.unlockedModels.includes('regression'),
      prerequisite: 'classification'
    }
  ];

  const handleUnlock = (modelId, cost) => {
    const success = unlockModel(modelId, cost);
    if (success) {
      setSelectedModel(null);
      setShowDetails(false);
    } else {
      alert('Nincs elegendő Tanulási Kredited a modell feloldásához!');
    }
  };

  const ModelCard = ({ model }) => (
    <motion.div
      className={`model-card \${model.unlocked ? 'unlocked' : 'locked'}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="model-header">
        <div className="model-icon">{model.icon}</div>
        <div className="model-info">
          <h3>{model.name}</h3>
          <p className="model-subtitle">{model.description}</p>
        </div>
        <div className="model-cost">
          {model.unlocked ? (
            <span className="unlocked-badge">✅ Feloldva</span>
          ) : (
            <span className="cost-badge">🪙 {model.cost} TK</span>
          )}
        </div>
      </div>

      <div className="model-features">
        <h4>🔧 Képességek:</h4>
        <ul>
          {model.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>

      <div className="model-application">
        <h4>🏭 Alkalmazási terület:</h4>
        <p>{model.applicationArea}</p>
      </div>

      <div className="model-example">
        <h4>💡 Példa használat:</h4>
        <p className="example-text">{model.example}</p>
      </div>

      <div className="model-actions">
        {!model.unlocked && (
          <>
            {model.prerequisite && !gameState.unlockedModels.includes(model.prerequisite) ? (
              <button className="btn-disabled" disabled>
                🔒 Előbb a {models.find(m => m.id === model.prerequisite)?.name} szükséges
              </button>
            ) : gameState.credits < model.cost ? (
              <button className="btn-disabled" disabled>
                ❌ Nincs elegendő kredit ({gameState.credits}/{model.cost} TK)
              </button>
            ) : (
              <button 
                className="btn-unlock"
                onClick={() => handleUnlock(model.id, model.cost)}
              >
                🚀 Modell Feloldása ({model.cost} TK)
              </button>
            )}
          </>
        )}

        {model.unlocked && (
          <div className="unlocked-info">
            <p>✅ <strong>Modell aktív és használatra kész!</strong></p>
            <p>Most már használhatod ezt a képességet a küldetések során.</p>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      className="model-unlock"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="page-header">
        <h2>🧠 Gépi Tanulási Modellek</h2>
        <p>Fejleszd ki az MI-rendszered képességeit új modellek feloldásával!</p>
      </div>

      <div className="unlock-progress">
        <h3>📊 Fejlesztési Folyamat</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `\${(gameState.unlockedModels.length / 2) * 100}%` }}
          ></div>
        </div>
        <p>{gameState.unlockedModels.length}/2 modell feloldva</p>
      </div>

      <div className="credits-display">
        <div className="credit-info">
          <span className="credit-icon">🪙</span>
          <span>Elérhető kreditek: <strong>{gameState.credits} TK</strong></span>
        </div>
      </div>

      <div className="models-grid">
        {models.map(model => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>

      <div className="development-info">
        <h3>🎓 Fejlesztési Útmutató</h3>
        <div className="info-cards">
          <div className="info-card">
            <h4>1️⃣ Első lépés: Klasszifikáció</h4>
            <p>
              Kezdd a klasszifikációs modellel! Ez tanítja meg az MI-nek, 
              hogy különbséget tegyen a jó és rossz termékek között.
            </p>
          </div>
          <div className="info-card">
            <h4>2️⃣ Második lépés: Regresszió</h4>
            <p>
              A regressziós modell numerikus előrejelzéseket készít. 
              Segít megjósolni a termelési mennyiségeket és optimalizálni a folyamatokat.
            </p>
          </div>
          <div className="info-card">
            <h4>3️⃣ Kombinált erő</h4>
            <p>
              Mindkét modell együtt alkot egy hatékony rendszert, amely 
              a gyár teljes működését optimalizálja!
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModelUnlock;
