const express = require('express');
const router = express.Router();
const FoodController = require('../controllers/FoodController');
const { protect } = require('../middleware/auth');

router.post('/', protect, FoodController.addFood);
router.get('/', protect, FoodController.getAllFoods);
router.get('/search', protect, FoodController.searchFoods);

module.exports = router;
