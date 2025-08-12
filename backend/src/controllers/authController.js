
const { open } = require('../db');
const { hashPass, compare } = require('../utils/hash');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET || 'dev_secret';
const { body, validationResult } = require('express-validator');

const registerValidations = [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').optional().isString()
];

async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password, firstName, lastName, role } = req.body;
  try {
    const db = open();
    const hashed = await hashPass(password);
    const stmt = db.prepare(`INSERT INTO users (email,password,firstName,lastName,role) VALUES (?,?,?,?,?)`);
    stmt.run(email, hashed, firstName || null, lastName || null, role || 'user', function (err) {
      if (err) {
        db.close();
        return res.status(400).json({ message: 'Email already exists' });
      }
      const user = { id: this.lastID, email, firstName, lastName, role: role || 'user' };
      const token = jwt.sign(user, secret, { expiresIn: '7d' });
      db.close();
      res.json({ token, user });
    });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
}

const loginValidations = [
  body('email').isEmail(),
  body('password').exists()
];

function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  const db = open();
  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, row) => {
    if (err) { db.close(); return res.status(500).json({ message: 'DB error' }); }
    if (!row) { db.close(); return res.status(400).json({ message: 'Invalid credentials' }); }
    const ok = await compare(password, row.password);
    if (!ok) { db.close(); return res.status(400).json({ message: 'Invalid credentials' }); }
    const user = { id: row.id, email: row.email, firstName: row.firstName, lastName: row.lastName, role: row.role };
    const token = jwt.sign(user, secret, { expiresIn: '7d' });
    db.close();
    res.json({ token, user });
  });
}

module.exports = { register, login, registerValidations, loginValidations };
