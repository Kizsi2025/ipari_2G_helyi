// DataAnalysis.js - Adatelemzés komponens
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { products, getProductStats } from '../data/products';

const DataAnalysis = ({ gameState }) => {
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentView, setCurrentView] = useState('table');

  const canAccessData = gameState.unlockedModels.includes('classification');
  const stats = getProductStats();

  // Szűrés és rendezés
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (filterCategory !== 'all') {
      filtered = products.filter(product => product.category === filterCategory);
    }

    return filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filterCategory, sortBy, sortOrder]);

  const getCategoryColor = (category) => {
    return category === 'Megfelelő' ? '#10b981' : '#ef4444';
  };

  const getColorCode = (color) => {
    const colorMap = {
      'Piros': '#ef4444',
      'Kék': '#3b82f6', 
      'Zöld': '#10b981'
    };
    return colorMap[color] || '#6b7280';
  };

  const StatCard = ({ title, value, icon, description }) => (
    <motion.div
      className="stat-card"
      whileHover={{ scale: 1.02 }}
    >
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3>{title}</h3>
        <div className="stat-value">{value}</div>
        <p className="stat-description">{description}</p>
      </div>
    </motion.div>
  );

  const ProductTable = () => (
    <div className="data-table-container">
      <div className="table-controls">
        <div className="filter-controls">
          <label>
            🔍 Szűrés kategória szerint:
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">Összes termék</option>
              <option value="Megfelelő">Megfelelő</option>
              <option value="Selejt">Selejt</option>
            </select>
          </label>

          <label>
            📊 Rendezés:
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="id">Termék ID</option>
              <option value="weight">Súly</option>
              <option value="color">Szín</option>
              <option value="size">Méret</option>
              <option value="category">Kategória</option>
            </select>
          </label>

          <button 
            className="sort-order-btn"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'} {sortOrder === 'asc' ? 'Növekvő' : 'Csökkenő'}
          </button>
        </div>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Termék ID</th>
              <th>Súly (g)</th>
              <th>Színkód</th>
              <th>Méret</th>
              <th>Kategória</th>
              <th>Állapot</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedProducts.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={product.category === 'Selejt' ? 'defective-row' : 'good-row'}
              >
                <td className="product-id">#{product.id}</td>
                <td className="weight">{product.weight}g</td>
                <td className="color">
                  <div className="color-indicator">
                    <div 
                      className="color-dot"
                      style={{ backgroundColor: getColorCode(product.color) }}
                    ></div>
                    {product.color}
                  </div>
                </td>
                <td className="size">{product.size}</td>
                <td className="category">
                  <span 
                    className="category-badge"
                    style={{ 
                      backgroundColor: getCategoryColor(product.category),
                      color: 'white'
                    }}
                  >
                    {product.category}
                  </span>
                </td>
                <td className="status">
                  {product.category === 'Megfelelő' ? '✅' : '❌'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const VisualizationView = () => (
    <div className="visualization-container">
      <div className="charts-grid">
        <div className="chart-card">
          <h3>📊 Kategória eloszlás</h3>
          <div className="pie-chart-simple">
            <div className="pie-segment good" style={{ flex: stats.megfelelő }}>
              Megfelelő ({stats.megfelelő})
            </div>
            <div className="pie-segment bad" style={{ flex: stats.selejt }}>
              Selejt ({stats.selejt})
            </div>
          </div>
          <p>Selejt arány: <strong>{stats.selejtArány}%</strong></p>
        </div>

        <div className="chart-card">
          <h3>🏷️ Színkód eloszlás</h3>
          <div className="color-distribution">
            {['Piros', 'Kék', 'Zöld'].map(color => {
              const count = products.filter(p => p.color === color).length;
              return (
                <div key={color} className="color-stat">
                  <div 
                    className="color-bar"
                    style={{ 
                      backgroundColor: getColorCode(color),
                      width: `\${(count / products.length) * 100}%`
                    }}
                  ></div>
                  <span>{color}: {count} db</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="chart-card">
          <h3>📏 Méret eloszlás</h3>
          <div className="size-distribution">
            {['Kicsi', 'Közepes', 'Nagy'].map(size => {
              const count = products.filter(p => p.size === size).length;
              return (
                <div key={size} className="size-stat">
                  <div className="size-icon">
                    {size === 'Kicsi' && '🔸'}
                    {size === 'Közepes' && '🔹'}
                    {size === 'Nagy' && '🔷'}
                  </div>
                  <span>{size}: {count} db</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  if (!canAccessData) {
    return (
      <div className="data-analysis locked-section">
        <div className="locked-message">
          <h2>🔒 Adatelemzés Zárva</h2>
          <p>
            Az adatelemzés eléréséhez előbb fel kell oldanod a 
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
      className="data-analysis"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="page-header">
        <h2>📊 Címkézett Adatcsomagok</h2>
        <p>Elemezd a Future-Tech gyár termékadatait a modellek betanításához!</p>
      </div>

      <div className="stats-overview">
        <StatCard
          title="Összes termék"
          value={stats.total}
          icon="📦"
          description="Címkézett adatminták"
        />
        <StatCard
          title="Megfelelő"
          value={stats.megfelelő}
          icon="✅"
          description="Minőségi termékek"
        />
        <StatCard
          title="Selejt"
          value={stats.selejt}
          icon="❌"
          description="Hibás termékek"
        />
        <StatCard
          title="Selejt arány"
          value={`\${stats.selejtArány}%`}
          icon="📈"
          description="Hibaaránya"
        />
      </div>

      <div className="view-controls">
        <div className="view-tabs">
          <button 
            className={`tab-btn \${currentView === 'table' ? 'active' : ''}`}
            onClick={() => setCurrentView('table')}
          >
            📋 Táblázat nézet
          </button>
          <button 
            className={`tab-btn \${currentView === 'visualization' ? 'active' : ''}`}
            onClick={() => setCurrentView('visualization')}
          >
            📊 Vizualizáció
          </button>
        </div>
      </div>

      {currentView === 'table' && <ProductTable />}
      {currentView === 'visualization' && <VisualizationView />}

      <div className="analysis-insights">
        <h3>🔍 Elemzési Megjegyzések</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>📊 Adatminőség</h4>
            <p>
              A címkézett adatcsomag {stats.total} terméket tartalmaz, 
              amely elegendő a klasszifikációs modell betanításához.
            </p>
          </div>
          <div className="insight-card">
            <h4>⚖️ Egyensúly</h4>
            <p>
              A selejt arány {stats.selejtArány}% - ez kiegyensúlyozott 
              adathalmazt jelent a modell számára.
            </p>
          </div>
          <div className="insight-card">
            <h4>🎯 Felhasználás</h4>
            <p>
              Ezek az adatok szolgálnak majd a "Sólyomszem" klasszifikációs 
              modell betanításához.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DataAnalysis;
