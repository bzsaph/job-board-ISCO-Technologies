
const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');

router.post('/register', authCtrl.registerValidations, authCtrl.register);
router.post('/login', authCtrl.loginValidations, authCtrl.login);

module.exports = router;
