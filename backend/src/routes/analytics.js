const express              = require('express');
const AnalyticsController  = require('../controllers/AnalyticsController');
const { authenticate }     = require('../middleware/auth');

const router = express.Router();
const ctrl   = new AnalyticsController();

router.use(authenticate);
router.get('/daily',   ctrl.getDailySummary);
router.get('/weekly',  ctrl.getWeeklyProgress);
router.get('/trends',  ctrl.getTrends);

module.exports = router;
