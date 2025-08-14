const express = require('express');
const router = express.Router();
const { apply, createValidations, upload, listByJob, updateStatus,getMyApplications } = require('../controllers/applicationsController');
const authMiddleware = require('../middleware/authMiddleware');

// User applies for a job
router.post(
  '/',
  authMiddleware(),              // <— ensures req.user exists for apply()
  upload.single('coverLetter'),   // multer for cover letter
  createValidations,             // validation for jobId and cvLink
  apply
);

router.get('/mine', authMiddleware(), getMyApplications);
// Admin views applications for a job
router.get('/job/:jobId', authMiddleware('admin'), listByJob);

// Admin updates application status
router.put('/:id', authMiddleware('admin'), updateStatus);

module.exports = router;
