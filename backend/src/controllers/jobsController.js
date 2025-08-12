
const { open } = require('../db');
const { body, validationResult } = require('express-validator');

const createValidations = [
  body('title').notEmpty(),
  body('description').notEmpty()
];

function list(req, res) {
  const { title, location } = req.query;
  let sql = 'SELECT * FROM jobs WHERE 1=1';
  const params = [];
  if (title) { sql += ' AND title LIKE ?'; params.push(`%${title}%`); }
  if (location) { sql += ' AND location LIKE ?'; params.push(`%${location}%`); }
  const db = open();
  db.all(sql, params, (err, rows) => {
    db.close();
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows);
  });
}

function getOne(req, res) {
  const db = open();
  db.get('SELECT * FROM jobs WHERE id = ?', [req.params.id], (err, row) => {
    db.close();
    if (err) return res.status(500).json({ message: 'DB error' });
    if (!row) return res.status(404).json({ message: 'Not found' });
    res.json(row);
  });
}

function create(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { title, company, location, description, requirements, salary } = req.body;
  const db = open();
  const stmt = db.prepare(`INSERT INTO jobs (title,company,location,description,requirements,salary,createdBy) VALUES (?,?,?,?,?,?,?)`);
  stmt.run(title, company || null, location || null, description, requirements || null, salary || null, req.user.id, function (err) {
    if (err) { db.close(); return res.status(500).json({ message: 'DB error' }); }
    db.get('SELECT * FROM jobs WHERE id = ?', [this.lastID], (e, row) => {
      db.close();
      res.json(row);
    });
  });
}

function update(req, res) {
  const { title, company, location, description, requirements, salary } = req.body;
  const db = open();
  db.run(`UPDATE jobs SET title=?, company=?, location=?, description=?, requirements=?, salary=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?`,
    [title, company, location, description, requirements, salary, req.params.id],
    function (err) {
      if (err) { db.close(); return res.status(500).json({ message: 'DB error' }); }
      db.get('SELECT * FROM jobs WHERE id = ?', [req.params.id], (e, row) => {
        db.close();
        res.json(row);
      });
    });
}

function remove(req, res) {
  const db = open();
  db.run('DELETE FROM jobs WHERE id = ?', [req.params.id], function (err) {
    db.close();
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json({ ok: true });
  });
}

module.exports = { list, getOne, create, update, remove, createValidations };
