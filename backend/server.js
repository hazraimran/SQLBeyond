// server.js
const mysql = require("mysql2");
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Just use npm start

const app = express();
app.use(cors());
app.use(express.json());

// Database connection configuration using the full URL from MYSQL_URL
const db = mysql.createConnection(process.env.MYSQL_URL);

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to the database.");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// Route to execute SQL queries
app.post("/execute-query", (req, res) => {
  const { query } = req.body;

  // Execute the query from the request body
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Error executing query" });
    }
    res.json({ results });
  });
});
