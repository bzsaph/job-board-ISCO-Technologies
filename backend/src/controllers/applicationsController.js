const { open } = require('../db');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup: only for coverLetter
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

// Validation: jobId and cvLink required
const createValidations = [
  body('jobId').isInt().withMessage('jobId must be a number'),
  body('cvLink').isURL().withMessage('cvLink must be a valid URL')
];

// Apply for a job
async function apply(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { jobId, cvLink } = req.body;
  const coverLetterFile = req.file; // only coverLetter

  const db = open();
  const stmt = db.prepare(
    'INSERT INTO applications (jobId, userId, coverLetter, cvLink) VALUES (?,?,?,?)'
  );

  stmt.run(
    jobId,
    req.user.id,
    coverLetterFile?.filename || null,
    cvLink || null,
    function (err) {
      if (err) { db.close(); return res.status(500).json({ message: 'DB error' }); }
      db.get('SELECT * FROM applications WHERE id = ?', [this.lastID], (e, row) => {
        db.close();
        res.json(row);
      });
    }
  );
}

// List applications by job (admin)
function listByJob(req, res) {
  const jobId = req.params.jobId;
  const db = open();
  db.all(`SELECT a.*, u.email as applicantEmail
          FROM applications a JOIN users u ON a.userId = u.id
          WHERE a.jobId = ?`, [jobId], (err, rows) => {
    db.close();
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows);
  });
}

async function getMyApplications(req, res) {
  const userId = req.user.id; // from auth middleware
  const db = open();

  db.all('SELECT * FROM applications WHERE userId = ?', [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    res.json(rows);
  });
}

// Update application status (admin)
function updateStatus(req, res) {
  const { status } = req.body;
  const allowed = ['pending','reviewed','accepted','rejected'];
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

  const db = open();
  db.run('UPDATE applications SET status=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?', [status, req.params.id], function(err) {
    if (err) { db.close(); return res.status(500).json({ message: 'DB error' }); }
    db.get('SELECT * FROM applications WHERE id = ?', [req.params.id], (e, row) => {
      db.close();
      res.json(row);
    });
  });
}

module.exports = { apply, createValidations, listByJob, updateStatus, upload,getMyApplications  };
