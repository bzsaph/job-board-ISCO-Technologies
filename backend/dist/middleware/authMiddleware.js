const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

function authMiddleware(requiredRole) {
    return (req, res, next) => {
        let token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        // Strip potential prefix (like '177|')
        if (token.includes("|")) token = token.split("|")[1];

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;

            if (requiredRole && decoded.role !== requiredRole) {
                return res.status(403).json({ message: "Access denied" });
            }

            next();
        } catch (err) {
            console.error("JWT verification error:", err.message);
            return res.status(401).json({ message: "Invalid token" });
        }
    };
}

module.exports = authMiddleware;
