const express        = require('express');
const MealController = require('../controllers/MealController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const ctrl   = new MealController();

router.use(authenticate);

// Static routes BEFORE dynamic /:id to prevent conflicts
router.get('/remaining', ctrl.getRemaining);

router.get('/',       ctrl.getDailyLog);
router.post('/',      ctrl.logMeal);
router.put('/:id',    ctrl.editMeal);
router.delete('/:id', ctrl.deleteMeal);

module.exports = router;
