const { open } = require('../db');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup for coverLetter
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
  const coverLetterFile = req.file; 

  const db = open();

  // Check if user already applied
  db.get(
    'SELECT * FROM applications WHERE jobId=? AND userId=?',
    [jobId, req.user.id],
    (err, row) => {
      if (err) {
        db.close();
        return res.status(500).json({ message: 'DB error' });
      }
      if (row) {
        db.close();
        return res.status(400).json({ message: 'You have already applied for this job' });
      }

      // Insert new application
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
  );
}

// List applications by job (admin)
function listByJob(req, res) {
  const jobId = req.params.jobId;
  const db = open();

  db.all(
    `SELECT a.*, u.email as applicantEmail
     FROM applications a 
     JOIN users u ON a.userId = u.id
     WHERE a.jobId = ?`,
    [jobId],
    (err, rows) => {
      db.close();
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json(rows);
    }
  );
}

// Get applications of logged-in user
async function getMyApplications(req, res) {
  try {
    const userId = req.user.id; 
    const db = open();

    const query = `
      SELECT a.*, j.title AS jobTitle
      FROM applications a
      JOIN jobs j ON a.jobId = j.id
      WHERE a.userId = ?
    `;

    db.all(query, [userId], (err, rows) => {
      db.close(); // always close DB
      if (err) {
        console.error('DB error:', err);
        return res.status(500).json({ message: 'DB error' });
      }

      // Ensure 200 response even if empty
      return res.status(200).json(rows || []);
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}



// Update application status (admin)
function updateStatus(req, res) {
  const { status } = req.body;
  const allowed = ['pending','reviewed','accepted','rejected'];
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

  const db = open();

  // Check current status first
  db.get('SELECT status FROM applications WHERE id = ?', [req.params.id], (err, row) => {
    if (err) { db.close(); return res.status(500).json({ message: 'DB error' }); }
    if (!row) { db.close(); return res.status(404).json({ message: 'Application not found' }); }

    // Prevent changing if already accepted or rejected
    if (['accepted','rejected'].includes(row.status)) {
      db.close();
      return res.status(400).json({ message: 'Cannot change status after final decision' });
    }

    // Update status
    db.run(
      'UPDATE applications SET status=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?',
      [status, req.params.id],
      function(err) {
        if (err) { db.close(); return res.status(500).json({ message: 'DB error' }); }
        db.get('SELECT * FROM applications WHERE id = ?', [req.params.id], (e, row) => {
          db.close();
          res.json(row);
        });
      }
    );
  });
}

module.exports = {
  apply,
  createValidations,
  listByJob,
  updateStatus,
  upload,
  getMyApplications
};
