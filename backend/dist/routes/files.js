// src/routes/files.js or inside your main server.js
const express = require('express');
const path = require('path');
const router = express.Router();

// Serve cover letters
router.get('/:filename', (req, res) => {
  const filename = req.params.filename;
  const options = { root: path.join(__dirname, '../../uploads') };
  res.sendFile(filename, options, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send('File not found');
    }
  });
});


module.exports = router;
