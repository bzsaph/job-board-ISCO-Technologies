const { open } = require('../db');
const { hashPass, compare } = require('../utils/hash');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET || 'dev_secret';
const { body, validationResult } = require('express-validator');

// Validation
const registerValidations = [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').optional().isString(),
  body('lastName').optional().isString()
];

const loginValidations = [
  body('email').isEmail(),
  body('password').exists()
];

// Helper to run a query with Promise
const runAsync = (db, sql, params = []) => new Promise((resolve, reject) => {
  const stmt = db.prepare(sql, (err) => {
    if (err) return reject(err);
  });
  stmt.run(...params, function (err) {
    if (err) reject(err);
    else resolve(this);
  });
});

// Helper to get a single row with Promise
const getAsync = (db, sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) reject(err);
    else resolve(row);
  });
});

// Register
async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password, firstName, lastName, role } = req.body;
  const db = open();

  try {
    const hashed = await hashPass(password);
    const stmt = `INSERT INTO users (email,password,firstName,lastName,role) VALUES (?,?,?,?,?)`;
    await runAsync(db, stmt, [email, hashed, firstName || null, lastName || null, role || 'user']);
    const row = await getAsync(db, `SELECT * FROM users WHERE email = ?`, [email]);

    const user = {
      id: row.id,
      email: row.email,
      firstName: row.firstName,
      lastName: row.lastName,
      role: row.role
    };

    const token = jwt.sign(user, secret, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    if (err.message.includes('UNIQUE')) res.status(400).json({ message: 'Email already exists' });
    else res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Login
async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const db = open();

  try {
    const row = await getAsync(db, `SELECT * FROM users WHERE email = ?`, [email]);
    if (!row) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await compare(password, row.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const user = {
      id: row.id,
      email: row.email,
      firstName: row.firstName,
      lastName: row.lastName,
      role: row.role
    };

    const token = jwt.sign(user, secret, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = { register, login, registerValidations, loginValidations };
