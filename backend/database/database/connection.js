const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Path to your database file
const dbPath = path.resolve(__dirname, "../../database/migrations/database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to the SQLite database.");
    }
});

module.exports = db;
