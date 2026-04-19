const express        = require('express');
const FoodController = require('../controllers/FoodController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const ctrl   = new FoodController();

router.use(authenticate);
router.get('/',     ctrl.searchFoods);
router.post('/',    ctrl.addCustomFood);
router.get('/:id',  ctrl.getFoodById);

module.exports = router;
