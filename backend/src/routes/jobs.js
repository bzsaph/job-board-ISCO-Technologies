
const express = require('express');
const router = express.Router();
const jobsCtrl = require('../controllers/jobsController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', jobsCtrl.list);
router.get('/:id', jobsCtrl.getOne);
router.post('/', auth, admin, jobsCtrl.createValidations, jobsCtrl.create);
router.put('/:id', auth, admin, jobsCtrl.createValidations, jobsCtrl.update);
router.delete('/:id', auth, admin, jobsCtrl.remove);

module.exports = router;
