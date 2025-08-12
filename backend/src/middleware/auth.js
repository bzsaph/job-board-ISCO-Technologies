
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET || 'dev_secret';

module.exports = function (req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token provided' });
  const token = auth.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token format' });
  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
