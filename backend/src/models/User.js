// models/User.js - Felhasználó modell
class User {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.name = data.name || '';
    this.teamName = data.teamName || 'Mintázatdekódolók';
    this.email = data.email || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.lastLoginAt = data.lastLoginAt || new Date().toISOString();
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.preferences = data.preferences || {
      theme: 'dark',
      language: 'hu',
      notifications: true
    };
    this.achievements = data.achievements || [];
    this.statistics = data.statistics || {
      totalSessions: 0,
      totalTimeSpent: 0, // másodpercekben
      highestScore: 0,
      modelsUnlocked: 0,
      challengesCompleted: 0
    };
  }

  // Egyedi ID generálása
  generateId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Felhasználó adatok validálása
  static validate(userData) {
    if (!userData || typeof userData !== 'object') {
      return { valid: false, error: 'Érvénytelen felhasználói adatok' };
    }

    // Név ellenőrzés
    if (!userData.name || typeof userData.name !== 'string' || userData.name.trim().length < 2) {
      return { valid: false, error: 'A név legalább 2 karakter hosszú legyen' };
    }

    // Csapatnév ellenőrzés
    if (userData.teamName && typeof userData.teamName !== 'string') {
      return { valid: false, error: 'Érvénytelen csapatnév' };
    }

    // Email ellenőrzés (ha van)
    if (userData.email && typeof userData.email !== 'string') {
      return { valid: false, error: 'Érvénytelen email cím' };
    }

    return { valid: true };
  }

  // Felhasználó adatok frissítése
  update(newData) {
    const validation = User.validate(newData);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Csak biztonságos mezők frissítése
    const allowedFields = ['name', 'teamName', 'email', 'preferences'];

    allowedFields.forEach(field => {
      if (newData[field] !== undefined) {
        this[field] = newData[field];
      }
    });

    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Statisztikák frissítése
  updateStatistics(stats) {
    this.statistics = {
      ...this.statistics,
      ...stats
    };
    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Achievement hozzáadása
  addAchievement(achievement) {
    if (!this.achievements.some(a => a.id === achievement.id)) {
      this.achievements.push({
        ...achievement,
        unlockedAt: new Date().toISOString()
      });
    }
    return this;
  }

  // Felhasználó objektum tisztítása (érzékeny adatok eltávolítása)
  toSafeObject() {
    const { id, name, teamName, createdAt, lastLoginAt, isActive, achievements, statistics } = this;
    return {
      id,
      name,
      teamName,
      createdAt,
      lastLoginAt,
      isActive,
      achievements,
      statistics
    };
  }

  // JSON szerializálás
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      teamName: this.teamName,
      email: this.email,
      createdAt: this.createdAt,
      lastLoginAt: this.lastLoginAt,
      isActive: this.isActive,
      preferences: this.preferences,
      achievements: this.achievements,
      statistics: this.statistics
    };
  }

  // Felhasználó objektum létrehozása JSON-ból
  static fromJSON(jsonData) {
    return new User(jsonData);
  }

  // Alapértelmezett felhasználó létrehozása
  static createDefault(name, teamName = 'Mintázatdekódolók') {
    return new User({
      name: name.trim(),
      teamName: teamName.trim()
    });
  }
}

module.exports = User;
