// utils/database.js - Adatbázis kapcsolat és műveletek
const fs = require('fs').promises;
const path = require('path');

// Egyszerű memória alapú adatbázis szimulációja
class SimpleDatabase {
  constructor() {
    this.data = new Map();
    this.connections = 0;
    this.isConnected = false;
  }

  // Adatbázis kapcsolat szimulációja
  async connect() {
    try {
      this.connections++;
      this.isConnected = true;
      console.log(`Adatbázis kapcsolat létrehozva (#${this.connections})`);

      // Alapértelmezett adatok betöltése
      await this.loadDefaultData();

      return {
        success: true,
        message: 'Adatbázis kapcsolat sikeres',
        connectionId: this.connections
      };
    } catch (error) {
      console.error('Adatbázis kapcsolat hiba:', error);
      throw new Error(`Adatbázis kapcsolat sikertelen: ${error.message}`);
    }
  }

  // Kapcsolat bontása
  async disconnect() {
    this.isConnected = false;
    console.log('Adatbázis kapcsolat lezárva');
    return { success: true, message: 'Kapcsolat lezárva' };
  }

  // Alapértelmezett adatok betöltése
  async loadDefaultData() {
    try {
      // Termék adatok betöltése
      const productsPath = path.join(__dirname, '../data/products.json');
      const productsData = await fs.readFile(productsPath, 'utf8');
      const products = JSON.parse(productsData);
      this.data.set('products', products);

      // Eseménykártyák betöltése
      const eventCardsPath = path.join(__dirname, '../data/eventCards.json');
      const eventCardsData = await fs.readFile(eventCardsPath, 'utf8');
      const eventCards = JSON.parse(eventCardsData);
      this.data.set('eventCards', eventCards);

      console.log('Alapértelmezett adatok sikeresen betöltve');

    } catch (error) {
      console.warn('Alapértelmezett adatok betöltése sikertelen:', error.message);
      // Fallback adatok
      this.data.set('products', []);
      this.data.set('eventCards', []);
    }
  }

  // Adatok lekérése
  async find(collection, query = {}) {
    if (!this.isConnected) {
      throw new Error('Nincs adatbázis kapcsolat');
    }

    const data = this.data.get(collection) || [];

    // Egyszerű szűrés
    if (Object.keys(query).length === 0) {
      return data;
    }

    return data.filter(item => {
      return Object.keys(query).every(key => {
        if (query[key] === undefined) return true;
        return item[key] === query[key];
      });
    });
  }

  // Egy elem lekérése
  async findOne(collection, query) {
    const results = await this.find(collection, query);
    return results.length > 0 ? results[0] : null;
  }

  // Adatok beszúrása
  async insert(collection, document) {
    if (!this.isConnected) {
      throw new Error('Nincs adatbázis kapcsolat');
    }

    let data = this.data.get(collection) || [];

    // ID generálása ha nincs
    if (!document.id) {
      const maxId = data.length > 0 ? Math.max(...data.map(item => item.id || 0)) : 0;
      document.id = maxId + 1;
    }

    document.createdAt = new Date().toISOString();
    document.updatedAt = new Date().toISOString();

    data.push(document);
    this.data.set(collection, data);

    return { success: true, insertedId: document.id, document };
  }

  // Adatok frissítése
  async update(collection, query, updateData) {
    if (!this.isConnected) {
      throw new Error('Nincs adatbázis kapcsolat');
    }

    let data = this.data.get(collection) || [];
    let updatedCount = 0;

    data = data.map(item => {
      const matches = Object.keys(query).every(key => item[key] === query[key]);
      if (matches) {
        updatedCount++;
        return {
          ...item,
          ...updateData,
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });

    this.data.set(collection, data);
    return { success: true, modifiedCount: updatedCount };
  }

  // Adatok törlése
  async delete(collection, query) {
    if (!this.isConnected) {
      throw new Error('Nincs adatbázis kapcsolat');
    }

    let data = this.data.get(collection) || [];
    const originalLength = data.length;

    data = data.filter(item => {
      return !Object.keys(query).every(key => item[key] === query[key]);
    });

    this.data.set(collection, data);
    const deletedCount = originalLength - data.length;

    return { success: true, deletedCount };
  }

  // Gyűjtemény statisztikák
  async getCollectionStats(collection) {
    const data = this.data.get(collection) || [];
    return {
      collection,
      count: data.length,
      size: JSON.stringify(data).length,
      indexes: ['id', 'createdAt', 'updatedAt']
    };
  }

  // Adatbázis statisztikák
  async getDatabaseStats() {
    const collections = Array.from(this.data.keys());
    const stats = {};

    for (const collection of collections) {
      stats[collection] = await this.getCollectionStats(collection);
    }

    return {
      isConnected: this.isConnected,
      connections: this.connections,
      collections: collections.length,
      totalDocuments: collections.reduce((sum, coll) => 
        sum + (this.data.get(coll) || []).length, 0),
      details: stats
    };
  }

  // Adat exportálás
  async exportData(collection) {
    const data = this.data.get(collection) || [];
    return {
      collection,
      exportDate: new Date().toISOString(),
      count: data.length,
      data
    };
  }

  // Adat importálás
  async importData(collection, data) {
    if (!Array.isArray(data)) {
      throw new Error('Az import adat tömb kell legyen');
    }

    this.data.set(collection, data);
    return {
      success: true,
      collection,
      importedCount: data.length,
      importDate: new Date().toISOString()
    };
  }

  // Backup létrehozása
  async createBackup() {
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      collections: {}
    };

    for (const [collection, data] of this.data.entries()) {
      backup.collections[collection] = data;
    }

    return backup;
  }

  // Backup visszaállítása
  async restoreBackup(backup) {
    if (!backup.collections) {
      throw new Error('Érvénytelen backup formátum');
    }

    for (const [collection, data] of Object.entries(backup.collections)) {
      this.data.set(collection, data);
    }

    return {
      success: true,
      restoredCollections: Object.keys(backup.collections).length,
      backupDate: backup.timestamp
    };
  }
}

// Singleton instance
const db = new SimpleDatabase();

module.exports = {
  db,
  SimpleDatabase
};
