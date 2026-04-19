const MealService      = require('../services/MealService');
const NutritionService = require('../services/NutritionService');
const UserRepository   = require('../repositories/UserRepository');
const db = require('../config/database');

class MealController {
  constructor() {
    this.mealService      = new MealService();
    this.nutritionService = new NutritionService();
    this.userRepository   = new UserRepository(db);

    this.getDailyLog    = this.getDailyLog.bind(this);
    this.logMeal        = this.logMeal.bind(this);
    this.editMeal       = this.editMeal.bind(this);
    this.deleteMeal     = this.deleteMeal.bind(this);
    this.getRemaining   = this.getRemaining.bind(this);
  }

  async getDailyLog(req, res) {
    try {
      const { date } = req.query;
      const grouped  = await this.mealService.getDailyLog(req.userId, date);
      const totals   = await this.mealService.getDailyTotals(req.userId, date);
      res.json({ meals: grouped, totals });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async logMeal(req, res) {
    try {
      const { foodId, mealType, quantity, date } = req.body;
      if (!foodId || !mealType || !quantity) {
        return res.status(400).json({ error: 'foodId, mealType, and quantity are required' });
      }
      const meal = await this.mealService.logMeal(req.userId, foodId, mealType, quantity, date);
      res.status(201).json(meal.toJSON());
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async editMeal(req, res) {
    try {
      const { mealType, quantity } = req.body;
      const meal = await this.mealService.editMeal(parseInt(req.params.id), req.userId, mealType, quantity);
      res.json(meal.toJSON());
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async deleteMeal(req, res) {
    try {
      await this.mealService.deleteMeal(parseInt(req.params.id), req.userId);
      res.json({ message: 'Meal entry deleted successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getRemaining(req, res) {
    try {
      const { date } = req.query;
      const user     = await this.userRepository.findById(req.userId);
      const goals    = this.nutritionService.calculateDailyGoals(user);
      const consumed = await this.mealService.getDailyTotals(req.userId, date);
      const remaining = this.nutritionService.calculateRemaining(goals, consumed);
      res.json({ goals, consumed: remaining });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = MealController;
