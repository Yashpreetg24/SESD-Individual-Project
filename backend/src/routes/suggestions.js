const express            = require('express');
const SuggestionService  = require('../services/SuggestionService');
const NutritionService   = require('../services/NutritionService');
const MealService        = require('../services/MealService');
const UserRepository     = require('../repositories/UserRepository');
const { authenticate }   = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const userRepo         = new UserRepository(db);
    const mealService      = new MealService();
    const nutritionService = new NutritionService();
    const suggestionService = new SuggestionService();

    const { date } = req.query;
    const user     = await userRepo.findById(req.userId);
    const goals    = nutritionService.calculateDailyGoals(user);
    const consumed = await mealService.getDailyTotals(req.userId, date);
    const remaining = nutritionService.calculateRemaining(goals, consumed);
    const suggestions = await suggestionService.suggestFoods(remaining.calories, remaining.protein);

    res.json({ remaining, suggestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
