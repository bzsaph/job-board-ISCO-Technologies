// controllers/usersController.js
const { open } = require('../db');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

// Validation rules
const createValidations = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  body('role').isIn(['admin', 'user']).withMessage('Role must be admin or user')
];

// List all users (optionally filter by role or email)
function list(req, res) {
  const { role, email } = req.query;
  let sql = 'SELECT id, email, firstName, lastName, role, createdAt, updatedAt FROM users WHERE 1=1';
  const params = [];
  if (role) { sql += ' AND role = ?'; params.push(role); }
  if (email) { sql += ' AND email LIKE ?'; params.push(`%${email}%`); }

  const db = open();
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows);
  });
}

// Get one user
function getOne(req, res) {
  const db = open();
  db.get(
    'SELECT id, email, firstName, lastName, role, createdAt, updatedAt FROM users WHERE id = ?',
    [req.params.id],
    (err, row) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      if (!row) return res.status(404).json({ message: 'Not found' });
      res.json(row);
    }
  );
}

// Create user
async function createUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password, firstName, lastName, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const db = open();
  const stmt = db.prepare(`
    INSERT INTO users (email, password, firstName, lastName, role)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(email, hashedPassword, firstName, lastName, role, function (err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      return res.status(500).json({ message: 'DB error' });
    }
    stmt.finalize();

    db.get(
      'SELECT id, email, firstName, lastName, role, createdAt, updatedAt FROM users WHERE id = ?',
      [this.lastID],
      (e, row) => {
        if (e) return res.status(500).json({ message: 'DB error' });
        res.json(row);
      }
    );
  });
}

// Update user (password optional)
async function update(req, res) {
  const { email, password, firstName, lastName, role } = req.body;
  const db = open();

  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  const stmt = db.prepare(`
    UPDATE users
    SET email = ?, 
        password = COALESCE(?, password), 
        firstName = ?, 
        lastName = ?, 
        role = ?, 
        updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  stmt.run(email, hashedPassword, firstName, lastName, role, req.params.id, function (err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    stmt.finalize();

    db.get(
      'SELECT id, email, firstName, lastName, role, createdAt, updatedAt FROM users WHERE id = ?',
      [req.params.id],
      (e, row) => {
        if (e) return res.status(500).json({ message: 'DB error' });
        res.json(row);
      }
    );
  });
}

// Delete user
function remove(req, res) {
  const db = open();
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');

  stmt.run(req.params.id, function (err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    stmt.finalize();
    res.json({ ok: true });
  });
}

module.exports = { list, getOne, createUser, update, remove, createValidations };
