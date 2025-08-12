
const { open } = require('../db');
const { body, validationResult } = require('express-validator');

const createValidations = [
  body('jobId').isInt(),
  body('cvLink').optional().isURL().withMessage('cvLink must be a url'),
  body('coverLetter').optional().isString()
];

function apply(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { jobId, coverLetter, cvLink } = req.body;
  const db = open();
  const stmt = db.prepare('INSERT INTO applications (jobId,userId,coverLetter,cvLink) VALUES (?,?,?,?)');
  stmt.run(jobId, req.user.id, coverLetter || null, cvLink || null, function (err) {
    if (err) { db.close(); return res.status(500).json({ message: 'DB error' }); }
    db.get('SELECT * FROM applications WHERE id = ?', [this.lastID], (e, row) => {
      db.close();
      res.json(row);
    });
  });
}

function listByJob(req, res) {
  const jobId = req.params.jobId;
  const db = open();
  db.all(`SELECT a.*, u.email as applicantEmail, u.firstName as applicantFirstName, u.lastName as applicantLastName
          FROM applications a JOIN users u ON a.userId = u.id WHERE a.jobId = ?`, [jobId], (err, rows) => {
    db.close();
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows);
  });
}

function updateStatus(req, res) {
  const { status } = req.body;
  const allowed = ['pending','reviewed','accepted','rejected'];
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });
  const db = open();
  db.run('UPDATE applications SET status=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?', [status, req.params.id], function (err) {
    if (err) { db.close(); return res.status(500).json({ message: 'DB error' }); }
    db.get('SELECT * FROM applications WHERE id = ?', [req.params.id], (e, row) => {
      db.close();
      res.json(row);
    });
  });
}

module.exports = { apply, createValidations, listByJob, updateStatus };
