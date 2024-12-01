const mysql = require("mysql2/promise"); // Use promise-based MySQL
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

// Load and validate environment variables
const PORT = process.env.PORT || 3000;
const MYSQL_URL = process.env.MYSQL_URL;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

if (!MYSQL_URL || !HUGGINGFACE_API_KEY) {
  console.error("Error: Missing required environment variables.");
  process.exit(1);
}

// Express app setup
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool(MYSQL_URL);

(async () => {
  try {
    await pool.getConnection(); // Test the database connection
    console.log("Connected to the database.");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
})();

// API Routes

// Route to execute SQL queries
app.post("/execute-query", async (req, res) => {
  const { query, params } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required." });
  }

  try {
    const [results] = await pool.execute(query, params || []);
    res.json({ success: true, results });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ success: false, error: "Error executing query." });
  }
});

// Route to handle generating SQL query using Hugging Face
app.post("/generate-sql", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question is required." });
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B", // Replace with your desired Hugging Face model
      {
        inputs: question,
        parameters: { max_length: 150, temperature: 0.7 },
      },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        },
      }
    );

    console.log("Hugging Face Response:", response.data);

    res.json({
      success: true,
      query:
        response.data.generated_text ||
        response.data[0]?.generated_text ||
        "No query generated.",
    });
  } catch (err) {
    console.error(
      "Error interacting with Hugging Face:",
      err.response?.data || err.message
    );
    res
      .status(500)
      .json({ success: false, error: "Failed to generate SQL query." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
