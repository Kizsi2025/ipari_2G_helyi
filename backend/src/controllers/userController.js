// controllers/userController.js - Felhasználó műveletek kezelése
const User = require('../models/User');

class UserController {

  // Felhasználó létrehozása
  static async createUser(req, res) {
    try {
      const { name, teamName, email } = req.body;

      // Adatok validálása
      if (!name || name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: 'A név legalább 2 karakter hosszú legyen'
        });
      }

      // Új felhasználó létrehozása
      const userData = {
        name: name.trim(),
        teamName: teamName?.trim() || 'Mintázatdekódolók',
        email: email?.trim() || ''
      };

      const validation = User.validate(userData);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          error: validation.error
        });
      }

      const newUser = new User(userData);

      // Felhasználó mentése (memóriában vagy adatbázisban)
      // Itt egyszerűsített memória tárolás
      if (!global.users) {
        global.users = new Map();
      }
      global.users.set(newUser.id, newUser);

      res.status(201).json({
        success: true,
        message: 'Felhasználó sikeresen létrehozva',
        data: newUser.toSafeObject()
      });

    } catch (error) {
      console.error('Hiba a felhasználó létrehozása során:', error);
      res.status(500).json({
        success: false,
        error: 'Szerver hiba a felhasználó létrehozása során',
        message: error.message
      });
    }
  }

  // Felhasználó lekérése ID alapján
  static async getUserById(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'Felhasználó ID szükséges'
        });
      }

      // Felhasználó keresése
      const user = global.users?.get(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Felhasználó nem található',
          userId: userId.substring(0, 8) + '...'
        });
      }

      res.json({
        success: true,
        message: 'Felhasználó sikeresen lekérve',
        data: user.toSafeObject()
      });

    } catch (error) {
      console.error('Hiba a felhasználó lekérése során:', error);
      res.status(500).json({
        success: false,
        error: 'Szerver hiba a felhasználó lekérése során',
        message: error.message
      });
    }
  }

  // Felhasználó frissítése
  static async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const updateData = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'Felhasználó ID szükséges'
        });
      }

      // Felhasználó keresése
      const user = global.users?.get(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Felhasználó nem található'
        });
      }

      // Felhasználó frissítése
      user.update(updateData);
      global.users.set(userId, user);

      res.json({
        success: true,
        message: 'Felhasználó sikeresen frissítve',
        data: user.toSafeObject()
      });

    } catch (error) {
      console.error('Hiba a felhasználó frissítése során:', error);
      res.status(500).json({
        success: false,
        error: 'Szerver hiba a felhasználó frissítése során',
        message: error.message
      });
    }
  }

  // Felhasználó törlése
  static async deleteUser(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'Felhasználó ID szükséges'
        });
      }

      // Felhasználó keresése és törlése
      const userExists = global.users?.has(userId);
      if (!userExists) {
        return res.status(404).json({
          success: false,
          error: 'Felhasználó nem található'
        });
      }

      global.users.delete(userId);

      res.json({
        success: true,
        message: 'Felhasználó sikeresen törölve',
        deletedUserId: userId.substring(0, 8) + '...'
      });

    } catch (error) {
      console.error('Hiba a felhasználó törlése során:', error);
      res.status(500).json({
        success: false,
        error: 'Szerver hiba a felhasználó törlése során',
        message: error.message
      });
    }
  }

  // Felhasználó statisztikák frissítése
  static async updateUserStatistics(req, res) {
    try {
      const { userId } = req.params;
      const { statistics } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'Felhasználó ID szükséges'
        });
      }

      if (!statistics || typeof statistics !== 'object') {
        return res.status(400).json({
          success: false,
          error: 'Érvényes statisztikák szükségesek'
        });
      }

      // Felhasználó keresése
      const user = global.users?.get(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Felhasználó nem található'
        });
      }

      // Statisztikák frissítése
      user.updateStatistics(statistics);
      global.users.set(userId, user);

      res.json({
        success: true,
        message: 'Felhasználó statisztikák sikeresen frissítve',
        data: {
          userId: userId.substring(0, 8) + '...',
          statistics: user.statistics
        }
      });

    } catch (error) {
      console.error('Hiba a statisztikák frissítése során:', error);
      res.status(500).json({
        success: false,
        error: 'Szerver hiba a statisztikák frissítése során',
        message: error.message
      });
    }
  }

  // Achievement hozzáadása
  static async addAchievement(req, res) {
    try {
      const { userId } = req.params;
      const { achievement } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'Felhasználó ID szükséges'
        });
      }

      if (!achievement || !achievement.id || !achievement.name) {
        return res.status(400).json({
          success: false,
          error: 'Érvényes achievement adatok szükségesek (id, name)'
        });
      }

      // Felhasználó keresése
      const user = global.users?.get(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Felhasználó nem található'
        });
      }

      // Achievement hozzáadása
      user.addAchievement(achievement);
      global.users.set(userId, user);

      res.json({
        success: true,
        message: 'Achievement sikeresen hozzáadva',
        data: {
          userId: userId.substring(0, 8) + '...',
          newAchievement: achievement,
          totalAchievements: user.achievements.length
        }
      });

    } catch (error) {
      console.error('Hiba az achievement hozzáadása során:', error);
      res.status(500).json({
        success: false,
        error: 'Szerver hiba az achievement hozzáadása során',
        message: error.message
      });
    }
  }

  // Összes felhasználó lekérése (admin funkció)
  static async getAllUsers(req, res) {
    try {
      const { limit = 10, offset = 0 } = req.query;

      if (!global.users) {
        return res.json({
          success: true,
          message: 'Nincs regisztrált felhasználó',
          data: {
            users: [],
            total: 0,
            limit: parseInt(limit),
            offset: parseInt(offset)
          }
        });
      }

      const allUsers = Array.from(global.users.values());
      const totalUsers = allUsers.length;

      // Lapozás
      const startIndex = parseInt(offset);
      const endIndex = startIndex + parseInt(limit);
      const paginatedUsers = allUsers
        .slice(startIndex, endIndex)
        .map(user => user.toSafeObject());

      res.json({
        success: true,
        message: 'Felhasználók sikeresen lekérve',
        data: {
          users: paginatedUsers,
          total: totalUsers,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: endIndex < totalUsers
        }
      });

    } catch (error) {
      console.error('Hiba a felhasználók lekérése során:', error);
      res.status(500).json({
        success: false,
        error: 'Szerver hiba a felhasználók lekérése során',
        message: error.message
      });
    }
  }

  // Felhasználó keresése név alapján
  static async searchUsers(req, res) {
    try {
      const { query } = req.query;

      if (!query || query.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Keresési kifejezés legalább 2 karakter hosszú legyen'
        });
      }

      if (!global.users) {
        return res.json({
          success: true,
          message: 'Nincs találat',
          data: { users: [] }
        });
      }

      const searchTerm = query.trim().toLowerCase();
      const matchingUsers = Array.from(global.users.values())
        .filter(user => 
          user.name.toLowerCase().includes(searchTerm) ||
          user.teamName.toLowerCase().includes(searchTerm)
        )
        .map(user => user.toSafeObject());

      res.json({
        success: true,
        message: `${matchingUsers.length} felhasználó találva`,
        data: {
          users: matchingUsers,
          searchTerm: query.trim(),
          total: matchingUsers.length
        }
      });

    } catch (error) {
      console.error('Hiba a felhasználók keresése során:', error);
      res.status(500).json({
        success: false,
        error: 'Szerver hiba a felhasználók keresése során',
        message: error.message
      });
    }
  }
}

module.exports = UserController;
