const AnalyticsService = require('../services/AnalyticsService');
const NutritionService = require('../services/NutritionService');
const UserRepository   = require('../repositories/UserRepository');
const db = require('../config/database');

class AnalyticsController {
  constructor() {
    this.analyticsService  = new AnalyticsService();
    this.nutritionService  = new NutritionService();
    this.userRepository    = new UserRepository(db);

    this.getDailySummary   = this.getDailySummary.bind(this);
    this.getWeeklyProgress = this.getWeeklyProgress.bind(this);
    this.getTrends         = this.getTrends.bind(this);
  }

  async getDailySummary(req, res) {
    try {
      res.json(await this.analyticsService.getDailySummary(req.userId, req.query.date));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getWeeklyProgress(req, res) {
    try {
      res.json(await this.analyticsService.getWeeklyProgress(req.userId));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getTrends(req, res) {
    try {
      const user   = await this.userRepository.findById(req.userId);
      const goals  = this.nutritionService.calculateDailyGoals(user);
      const trends = await this.analyticsService.getNutritionTrends(req.userId);
      res.json({ trends, goals });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = AnalyticsController;
