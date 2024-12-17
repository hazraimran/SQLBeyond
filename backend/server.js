const mysql = require("mysql2/promise"); // Use promise-based MySQL
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const sqlParser = require("sql-parser"); // SQL Parser for syntax validation

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

// Hint generator with SQL parsing
app.post("/get-hint", (req, res) => {
  const { userQuery, taskDescription, retries } = req.body;

  if (!taskDescription || retries === undefined) {
    return res
      .status(400)
      .json({ error: "Task description and retries count are required." });
  }

  let hint = "";
  let stage = "S1";

  // Step 1: SQL Syntax Validation
  try {
    sqlParser.parse(userQuery); // This will throw an error if the syntax is invalid
  } catch (syntaxError) {
    return res.json({
      success: true,
      stage: "S1",
      hint: "Syntax Error: Check your query syntax. Ensure all keywords (e.g., SELECT, FROM) are correct.",
      details: syntaxError.message,
    });
  }

  const keywords = ["SELECT", "FROM", "WHERE", "JOIN"];

  // Step 2: Conceptual hints
  if (!userQuery || !keywords.some((kw) => userQuery.includes(kw))) {
    hint = "Start with a basic SQL query using `SELECT` and `FROM`.";
    stage = "S2";
  } else if (taskDescription.includes("columns")) {
    hint = "To display all columns, use `SELECT * FROM table_name`.";
    stage = "S2";
  }
  // Step 3: Problem-solving pathways for retries
  else if (retries >= 3) {
    hint =
      "You seem stuck! Break the task down: Identify the correct table, select the required columns, and apply filters if needed.";
    stage = "S3";
  } else {
    hint =
      "Check your `WHERE` clause or column names. Ensure they match the table schema.";
    stage = "S4";
  }

  return res.json({
    success: true,
    stage,
    hint,
  });
});

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }
  console.log(prompt);
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B",
      {
        inputs: prompt,
        parameters: { max_length: 50, temperature: 0.7 },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    res.json({
      success: true,
      response: response.data.generated_text || "No response generated.",
    });
  } catch (err) {
    console.error("Error interacting with Hugging Face:", err);
    res.status(500).json({ error: "Failed to interact with Hugging Face." });
  }
});

app.post("/generate-sql", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B",
      {
        inputs: prompt,
        parameters: { max_length: 50, temperature: 0.7 },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    res.json({
      success: true,
      response:
        response.data.generated_text ||
        response.data[0]?.generated_text ||
        "No response generated.",
    });
  } catch (err) {
    console.error("Error interacting with Hugging Face:", err.message);
    res.status(500).json({ error: "Failed to generate SQL." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
