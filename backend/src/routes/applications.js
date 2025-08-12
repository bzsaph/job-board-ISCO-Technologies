
const express = require('express');
const router = express.Router();
const appCtrl = require('../controllers/applicationsController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/', auth, appCtrl.createValidations, appCtrl.apply);
router.get('/job/:jobId', auth, admin, appCtrl.listByJob);
router.put('/:id', auth, admin, appCtrl.updateStatus);

module.exports = router;
