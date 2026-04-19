const bcrypt          = require('bcryptjs');
const UserRepository  = require('../repositories/UserRepository');
const NutritionService = require('../services/NutritionService');
const db = require('../config/database');

class ProfileController {
  constructor() {
    this.userRepository  = new UserRepository(db);
    this.nutritionService = new NutritionService();
    this.getProfile    = this.getProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  async getProfile(req, res) {
    try {
      const user = await this.userRepository.findById(req.userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      const goals = this.nutritionService.calculateDailyGoals(user);
      res.json({ ...user.toJSON(), goals });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const { name, age, height, weight, goal, gender, activityLevel } = req.body;
      const updated = await this.userRepository.update(req.userId, {
        name, age, height, weight, goal, gender,
        activity_level: activityLevel,
      });
      const goals = this.nutritionService.calculateDailyGoals(updated);
      res.json({ ...updated.toJSON(), goals });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'currentPassword and newPassword are required' });
      }
      const user  = await this.userRepository.findById(req.userId);
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) return res.status(400).json({ error: 'Current password is incorrect' });

      const hashed = await bcrypt.hash(newPassword, 12);
      await this.userRepository.updatePassword(req.userId, hashed);
      res.json({ message: 'Password updated successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = ProfileController;
