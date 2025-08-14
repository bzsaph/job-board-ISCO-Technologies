// routes/users.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.post('/', usersController.createValidations, usersController.createUser);

// You can add other routes as needed:
// router.get('/', usersController.list);
// router.get('/:id', usersController.getOne);
// router.put('/:id', usersController.update);
// router.delete('/:id', usersController.remove);

module.exports = router;
