const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    // Optional admin check
    console.log('Decoded user:', req.user);
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
