const MealLogRepository = require('../repositories/MealLogRepository');
const NutritionService = require('../services/NutritionService');
const SuggestionService = require('../services/SuggestionService');

class MealController {
  async logMeal(req, res) {
    try {
      const logData = { ...req.body, user_id: req.user._id };
      const log = await MealLogRepository.create(logData);
      res.status(201).json(log);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getDailyLogAndMacros(req, res) {
    try {
      const date = req.query.date ? new Date(req.query.date) : new Date();
      // Set to start and end of day
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      
      const mealLogs = await MealLogRepository.findByUserAndDate(req.user._id, startOfDay, endOfDay);
      
      const macros = NutritionService.calculateRemainingNutrition(req.user, mealLogs);
      
      res.json({ mealLogs, macros });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getSuggestions(req, res) {
    try {
      const { remainingCalories, remainingProtein } = req.body;
      const suggestions = await SuggestionService.suggestFoods(remainingCalories, remainingProtein);
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteMealLog(req, res) {
    try {
      await MealLogRepository.delete(req.params.id, req.user._id);
      res.json({ message: 'Meal log removed' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new MealController();
