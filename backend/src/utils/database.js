// utils/database.js - Memory Database
class MemoryDatabase {
  constructor() {
    this.connected = false;
  }

  async connect() {
    try {
      console.log('🔌 Memória adatbázis inicializálása...');
      
      // Globális tárolók létrehozása
      if (!global.users) global.users = new Map();
      if (!global.gameStates) global.gameStates = new Map();
      if (!global.sessions) global.sessions = new Map();
      
      // Kezdő adatok betöltése
      this.loadInitialData();
      
      this.connected = true;
      console.log('✅ Memória adatbázis kapcsolat létrehozva');
      console.log(`📊 Felhasználók: ${global.users.size}`);
      console.log(`🎮 Játék sessionök: ${global.gameStates.size}`);
      console.log(`🔑 Aktív sessionök: ${global.sessions.size}`);
      
      return true;
    } catch (error) {
      console.error('❌ Adatbázis kapcsolat hiba:', error);
      throw error;
    }
  }

  loadInitialData() {
    // Demo felhasználó
    const demoUser = {
      id: 'demo-user-1',
      name: 'Demo Dekódoló',
      teamName: 'Alpha Csapat',
      email: 'demo@future-tech.hu',
      createdAt: new Date().toISOString()
    };
    global.users.set(demoUser.id, demoUser);

    // Demo játék állapot
    const demoGameState = {
      userId: 'demo-user-1',
      credits: 50,
      currentPhase: 'model_selection',
      unlockedModels: [],
      completedChallenges: [],
      achievements: [],
      startTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      customData: {
        sessionEnded: false,
        presentationReady: false
      }
    };
    global.gameStates.set(demoUser.id, demoGameState);
  }

  // Adatbázis műveletek
  async findUser(userId) {
    return global.users.get(userId) || null;
  }

  async saveUser(userData) {
    global.users.set(userData.id, userData);
    return userData;
  }

  async findGameState(userId) {
    return global.gameStates.get(userId) || null;
  }

  async saveGameState(userId, gameState) {
    global.gameStates.set(userId, gameState);
    return gameState;
  }

  async getAllUsers() {
    return Array.from(global.users.values());
  }

  async getAllGameStates() {
    return Array.from(global.gameStates.values());
  }

  // Session kezelés
  createSession(userId, userData) {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session = {
      id: sessionId,
      userId,
      user: userData,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };
    
    global.sessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId) {
    return global.sessions.get(sessionId) || null;
  }

  updateSessionActivity(sessionId) {
    const session = global.sessions.get(sessionId);
    if (session) {
      session.lastActivity = new Date().toISOString();
      global.sessions.set(sessionId, session);
    }
    return session;
  }

  // Cleanup régi sessionök
  cleanupOldSessions() {
    const now = Date.now();
    const timeout = 24 * 60 * 60 * 1000; // 24 óra

    for (const [sessionId, session] of global.sessions.entries()) {
      const lastActivity = new Date(session.lastActivity).getTime();
      if (now - lastActivity > timeout) {
        global.sessions.delete(sessionId);
        console.log(`🧹 Régi session törölve: ${sessionId}`);
      }
    }
  }
}

const db = new MemoryDatabase();

module.exports = { db };
