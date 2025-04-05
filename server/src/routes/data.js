// backend/routes/data.js
const express = require("express");
const pool = require("../db"); // Import the database connection

const router = express.Router();

// API route to get data from the database
router.get("/data", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router; // Export the router
