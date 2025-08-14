const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../database/migrations/database_connection"); // adjust path
const authMiddleware = require("../middleware/authMiddleware");

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// LOGIN (works for both admin and user)
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.getUserByEmail(email); // adjust to your DB method
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Create JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// PROTECTED ROUTE (Admin only)
router.get("/admin-data", authMiddleware("admin"), (req, res) => {
    res.json({ message: "Welcome, Admin!" });
});

// PROTECTED ROUTE (User only)
router.get("/user-data", authMiddleware("user"), (req, res) => {
    res.json({ message: "Welcome, User!" });
});

module.exports = router;

