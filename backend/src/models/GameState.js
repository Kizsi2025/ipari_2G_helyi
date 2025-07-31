// models/GameState.js - Játékállapot modell
class GameState {
  constructor(data = {}) {
    this.userId = data.userId || null;
    this.credits = data.credits !== undefined ? data.credits : 50;
    this.unlockedModels = data.unlockedModels || [];
    this.completedChallenges = data.completedChallenges || [];
    this.currentPhase = data.currentPhase || 'start';
    this.playerName = data.playerName || '';
    this.teamName = data.teamName || 'Mintázatdekódolók';
    this.sessionStartTime = data.sessionStartTime || new Date().toISOString();
    this.lastUpdated = data.lastUpdated || new Date().toISOString();
    this.totalPlayTime = data.totalPlayTime || 0; // másodpercekben
    this.gameVersion = data.gameVersion || '1.0.0';
    this.customData = data.customData || {}; // Egyéni adatok tárolása
  }

  // Alapértelmezett játékállapot
  static getDefault(userId = null) {
    return new GameState({
      userId,
      credits: 50,
      unlockedModels: [],
      completedChallenges: [],
      currentPhase: 'start',
      playerName: '',
      teamName: 'Mintázatdekódolók'
    });
  }

  // Játékállapot validálása
  static validate(gameState) {
    if (!gameState || typeof gameState !== 'object') {
      return false;
    }

    // Kötelező mezők ellenőrzése
    const requiredFields = ['credits', 'unlockedModels', 'completedChallenges'];
    for (const field of requiredFields) {
      if (gameState[field] === undefined) {
        return false;
      }
    }

    // Típus ellenőrzések
    if (typeof gameState.credits !== 'number' || gameState.credits < 0) {
      return false;
    }

    if (!Array.isArray(gameState.unlockedModels)) {
      return false;
    }

    if (!Array.isArray(gameState.completedChallenges)) {
      return false;
    }

    // Modell típusok ellenőrzése
    const validModels = ['classification', 'regression'];
    for (const model of gameState.unlockedModels) {
      if (!validModels.includes(model)) {
        return false;
      }
    }

    return true;
  }

  // Modell feloldása
  unlockModel(modelType, cost) {
    if (this.unlockedModels.includes(modelType)) {
      throw new Error('Ez a modell már fel van oldva');
    }

    if (this.credits < cost) {
      throw new Error('Nincs elegendő Tanulási kredit');
    }

    // Előfeltétel ellenőrzése
    if (modelType === 'regression' && !this.unlockedModels.includes('classification')) {
      throw new Error('Előbb a klasszifikációs modellt kell feloldani');
    }

    this.credits -= cost;
    this.unlockedModels.push(modelType);
    this.lastUpdated = new Date().toISOString();

    return this;
  }

  // Küldetés teljesítése
  completeChallenge(challengeId, cost, reward = 5) {
    if (this.completedChallenges.includes(challengeId)) {
      throw new Error('Ez a küldetés már teljesítve van');
    }

    if (!this.unlockedModels.includes('regression')) {
      throw new Error('A regressziós modell szükséges a küldetések teljesítéséhez');
    }

    if (this.credits < cost) {
      throw new Error('Nincs elegendő Tanulási kredit');
    }

    this.credits -= cost;
    this.credits += reward;
    this.completedChallenges.push(challengeId);
    this.lastUpdated = new Date().toISOString();

    return this;
  }

  // Fázis frissítése
  updatePhase() {
    if (this.unlockedModels.length === 0) {
      this.currentPhase = 'training';
    } else if (this.unlockedModels.length === 1) {
      this.currentPhase = 'development';
    } else if (this.completedChallenges.length < 2) {
      this.currentPhase = 'challenges';
    } else {
      this.currentPhase = 'presentation';
    }

    this.lastUpdated = new Date().toISOString();
    return this.currentPhase;
  }

  // Játék statisztikák számítása
  getStatistics() {
    const stats = {
      credits: this.credits,
      unlockedModelsCount: this.unlockedModels.length,
      completedChallengesCount: this.completedChallenges.length,
      currentPhase: this.currentPhase,
      efficiency: this.calculateEfficiency(),
      progress: this.calculateProgress(),
      achievements: this.getAchievements()
    };

    return stats;
  }

  // Hatékonyság számítása
  calculateEfficiency() {
    const maxCredits = 50;
    const creditsSpent = maxCredits - this.credits;
    const modelsUnlocked = this.unlockedModels.length;
    const challengesCompleted = this.completedChallenges.length;

    if (creditsSpent === 0) return 100;

    const value = (modelsUnlocked * 20) + (challengesCompleted * 10);
    const efficiency = Math.min(100, (value / creditsSpent) * 100);

    return Math.round(efficiency);
  }

  // Haladás számítása
  calculateProgress() {
    const maxModels = 2;
    const maxChallenges = 4;

    const modelProgress = (this.unlockedModels.length / maxModels) * 50;
    const challengeProgress = (this.completedChallenges.length / maxChallenges) * 50;

    return Math.round(modelProgress + challengeProgress);
  }

  // Elért achievements
  getAchievements() {
    const achievements = [];

    if (this.unlockedModels.includes('classification')) {
      achievements.push({
        id: 'first_model',
        name: 'Első Modell',
        description: 'Klasszifikációs modell feloldva',
        icon: '🎯'
      });
    }

    if (this.unlockedModels.includes('regression')) {
      achievements.push({
        id: 'second_model',
        name: 'Teljes Rendszer',
        description: 'Mindkét modell feloldva',
        icon: '🧠'
      });
    }

    if (this.completedChallenges.length >= 1) {
      achievements.push({
        id: 'first_challenge',
        name: 'Első Küldetés',
        description: 'Első eseménykártya teljesítve',
        icon: '🏆'
      });
    }

    if (this.completedChallenges.length >= 4) {
      achievements.push({
        id: 'all_challenges',
        name: 'Mester Dekódoló',
        description: 'Összes küldetés teljesítve',
        icon: '👑'
      });
    }

    if (this.credits >= 40) {
      achievements.push({
        id: 'credit_saver',
        name: 'Takarékos',
        description: '40+ kredit megtartva',
        icon: '💎'
      });
    }

    return achievements;
  }

  // Játékállapot mentése
  save() {
    this.lastUpdated = new Date().toISOString();
    return this.toJSON();
  }

  // JSON szerializálás
  toJSON() {
    return {
      userId: this.userId,
      credits: this.credits,
      unlockedModels: this.unlockedModels,
      completedChallenges: this.completedChallenges,
      currentPhase: this.currentPhase,
      playerName: this.playerName,
      teamName: this.teamName,
      sessionStartTime: this.sessionStartTime,
      lastUpdated: this.lastUpdated,
      totalPlayTime: this.totalPlayTime,
      gameVersion: this.gameVersion,
      customData: this.customData
    };
  }

  // JSON-ból objektum létrehozása
  static fromJSON(jsonData) {
    return new GameState(jsonData);
  }

  // Játékállapot alaphelyzetbe állítása
  reset() {
    this.credits = 50;
    this.unlockedModels = [];
    this.completedChallenges = [];
    this.currentPhase = 'start';
    this.sessionStartTime = new Date().toISOString();
    this.lastUpdated = new Date().toISOString();
    this.totalPlayTime = 0;
    this.customData = {};

    return this;
  }
}

module.exports = GameState;
