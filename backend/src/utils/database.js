// utils/database.js - Memory Database
class MemoryDatabase {
  constructor() {
    this.connected = false;
  }

  async connect() {
    try {
      console.log('🔌 Memória adatbázis inicializálása...');
      
      if (!global.users) global.users = new Map();
      if (!global.gameStates) global.gameStates = new Map();
      if (!global.sessions) global.sessions = new Map();
      
      this.connected = true;
      console.log('✅ Memória adatbázis kapcsolat létrehozva');
      return true;
    } catch (error) {
      console.error('❌ Adatbázis kapcsolat hiba:', error);
      throw error;
    }
  }
}

const db = new MemoryDatabase();
module.exports = { db };
