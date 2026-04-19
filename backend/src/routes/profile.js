const express           = require('express');
const ProfileController = require('../controllers/ProfileController');
const { authenticate }  = require('../middleware/auth');

const router            = express.Router();
const ctrl              = new ProfileController();

router.use(authenticate);
router.get('/',          ctrl.getProfile);
router.put('/',          ctrl.updateProfile);
router.put('/password',  ctrl.changePassword);

module.exports = router;
