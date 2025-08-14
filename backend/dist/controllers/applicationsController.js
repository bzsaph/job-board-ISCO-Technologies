const { open } = require('../db');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ----------------- Async SQLite helpers -----------------
const getAsync = (db, sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
});

const allAsync = (db, sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});

const runAsync = (db, sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err) {
    if (err) reject(err);
    else resolve(this);
  });
});

// ----------------- Multer setup for coverLetter -----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ----------------- Validations -----------------
const createValidations = [
  body('jobId').isInt().withMessage('jobId must be a number'),
  body('cvLink').isURL().withMessage('cvLink must be a valid URL')
];

// ----------------- Apply for a job -----------------
async function apply(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { jobId, cvLink } = req.body;
  const coverLetterFile = req.file; 
  const db = open();

  try {
    // Check if user already applied
    const existing = await getAsync(db, 
      'SELECT * FROM applications WHERE jobId=? AND userId=?',
      [jobId, req.user.id]
    );
    if (existing) return res.status(400).json({ message: 'You have already applied for this job' });

    // Insert new application
    const stmt = await runAsync(db, 
      'INSERT INTO applications (jobId, userId, coverLetter, cvLink) VALUES (?,?,?,?)',
      [jobId, req.user.id, coverLetterFile?.filename || null, cvLink || null]
    );

    const row = await getAsync(db, 'SELECT * FROM applications WHERE id = ?', [stmt.lastID]);
    res.json(row);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'DB error', error: err.message });
  } finally {
    db.close();
  }
}

// ----------------- List applications by job (admin) -----------------
async function listByJob(req, res) {
  const db = open();
  const jobId = req.params.jobId;

  try {
    const rows = await allAsync(db, `
      SELECT a.*, u.email as applicantEmail
      FROM applications a 
      JOIN users u ON a.userId = u.id
      WHERE a.jobId = ?
    `, [jobId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'DB error', error: err.message });
  } finally {
    db.close();
  }
}

// ----------------- Get applications of logged-in user -----------------
async function getMyApplications(req, res) {
  const db = open();

  try {
    const rows = await allAsync(db, `
      SELECT a.*, j.title AS jobTitle
      FROM applications a
      JOIN jobs j ON a.jobId = j.id
      WHERE a.userId = ?
    `, [req.user.id]);

    res.status(200).json(rows || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'DB error', error: err.message });
  } finally {
    db.close();
  }
}

// ----------------- Update application status (admin) -----------------
async function updateStatus(req, res) {
  const { status } = req.body;
  const allowed = ['pending','reviewed','accepted','rejected'];
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

  const db = open();
  try {
    const row = await getAsync(db, 'SELECT status FROM applications WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ message: 'Application not found' });
    if (['accepted','rejected'].includes(row.status)) return res.status(400).json({ message: 'Cannot change status after final decision' });

    await runAsync(db, 'UPDATE applications SET status=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?', [status, req.params.id]);
    const updated = await getAsync(db, 'SELECT * FROM applications WHERE id = ?', [req.params.id]);
    res.json(updated);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'DB error', error: err.message });
  } finally {
    db.close();
  }
}

module.exports = {
  apply,
  createValidations,
  listByJob,
  getMyApplications,
  updateStatus,
  upload
};
