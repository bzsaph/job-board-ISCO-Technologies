// controllers/jobsController.js
const { open } = require('../db');
const { body, validationResult } = require('express-validator');

// Validation rules
const createValidations = [
  body('title').notEmpty(),
  body('description').notEmpty()
];

// List all jobs with optional filters
function list(req, res) {
  const { title, location } = req.query;
  let sql = 'SELECT * FROM jobs WHERE 1=1';
  const params = [];
  if (title) { sql += ' AND title LIKE ?'; params.push(`%${title}%`); }
  if (location) { sql += ' AND location LIKE ?'; params.push(`%${location}%`); }

  const db = open();
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows);
  });
}

// Get single job
function getOne(req, res) {
  const db = open();
  db.get('SELECT * FROM jobs WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!row) return res.status(404).json({ message: 'Not found' });
    res.json(row);
  });
}

// Create a new job
function createJob(req, res) {
  console.log('Creating job with body:', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { title, company, location, description, requirements, salary } = req.body;
  const db = open();

  const stmt = db.prepare(`
    INSERT INTO jobs (title, company, location, description, requirements, salary)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(title, company || null, location || null, description, requirements || null, salary || null, function(err) {
    if (err) return res.status(500).json({ message: 'DB error' });

    // Finalize statement
    stmt.finalize();

    // Return newly created job
    db.get('SELECT * FROM jobs WHERE id = ?', [this.lastID], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.json(row);
    });
  });
}

// Update an existing job
function update(req, res) {
  const { title, company, location, description, requirements, salary } = req.body;
  const db = open();

  const stmt = db.prepare(`
    UPDATE jobs 
    SET title=?, company=?, location=?, description=?, requirements=?, salary=?, updatedAt=CURRENT_TIMESTAMP
    WHERE id=?
  `);

  stmt.run(title, company || null, location || null, description, requirements || null, salary || null, req.params.id, function(err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    stmt.finalize();

    db.get('SELECT * FROM jobs WHERE id = ?', [req.params.id], (e, row) => {
      if (e) return res.status(500).json({ message: 'DB error' });
      res.json(row);
    });
  });
}

// Delete a job
function remove(req, res) {
  const db = open();
  const stmt = db.prepare('DELETE FROM jobs WHERE id = ?');

  stmt.run(req.params.id, function(err) {
    if (err) return res.status(500).json({ message: 'DB error' });
    stmt.finalize();
    res.json({ ok: true });
  });
}

module.exports = { list, getOne, createJob, update, remove, createValidations };
