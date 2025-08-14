// routes/users.js
const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/usersController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// List users (admin only)
router.get('/', auth, admin, usersCtrl.list);

// Get one user (admin or same user)
router.get('/:id', auth, (req, res, next) => {
  // Allow admin or the same user to view
  if (req.user.role === 'admin' || req.user.id == req.params.id) {
    return usersCtrl.getOne(req, res, next);
  }
  return res.status(403).json({ message: 'Access denied' });
});

// Create new user (admin only)
router.post('/', auth, admin, usersCtrl.createValidations, usersCtrl.createUser);

// Update user (admin or same user)
router.put('/:id', auth, (req, res, next) => {
  if (req.user.role === 'admin' || req.user.id == req.params.id) {
    return usersCtrl.update(req, res, next);
  }
  return res.status(403).json({ message: 'Access denied' });
});

// Delete user (admin only)
router.delete('/:id', auth, admin, usersCtrl.remove);

module.exports = router;
