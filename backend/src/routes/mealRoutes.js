const express = require('express');
const router = express.Router();
const MealController = require('../controllers/MealController');
const { protect } = require('../middleware/auth');

router.post('/', protect, MealController.logMeal);
router.get('/daily', protect, MealController.getDailyLogAndMacros);
router.post('/suggest', protect, MealController.getSuggestions);
router.delete('/:id', protect, MealController.deleteMealLog);

module.exports = router;
