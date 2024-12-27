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

// Endpoint to execute a SQL query
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

app.post("/get-hint", (req, res) => {
  const { userQuery, taskDescription, retries } = req.body;

  if (!taskDescription || retries === undefined || !userQuery) {
    return res
      .status(400)
      .json({ error: "Task description, retries, and query are required." });
  }

  const { concepts, columnNames, hints } = taskDescription;

  // Stage 1: Check Missing Concepts or Columns.
  const checkForMissingItems = (query, items) => {
    return items.filter(
      (item) => !query.toUpperCase().includes(item.toUpperCase())
    );
  };

  const missingConcepts = checkForMissingItems(userQuery, concepts);
  const missingColumns = checkForMissingItems(userQuery, columnNames);

  if (missingConcepts.length > 0 || missingColumns.length > 0) {
    const hint = `Your query is missing the following: ${
      missingConcepts.length > 0
        ? `Keywords: ${missingConcepts.join(", ")}`
        : ""
    } ${
      missingColumns.length > 0 ? `Columns: ${missingColumns.join(", ")}` : ""
    }`.trim();
    return res.json({
      success: true,
      stage: "S1",
      hint,
    });
  }

  // Stage 2: Metaphorical Guidance.
  if (hints.metaphor) {
    return res.json({
      success: true,
      stage: "S2",
      hint: hints.metaphor,
    });
  }

  // Stage 3: English-Based Query Guidance.
  if (hints.english) {
    return res.json({
      success: true,
      stage: "S3",
      hint: hints.english,
    });
  }

  // Default case: Debugging hint.
  const hint =
    "Check the structure of your query. Ensure all required elements (keywords, columns, and table) are included and correctly specified.";
  return res.json({
    success: true,
    stage: "S4",
    hint,
  });
});

// Chat endpoint to interact with Hugging Face API
app.post("/chat", async (req, res) => {
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
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
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

// SQL generation endpoint using Hugging Face API
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

app.post("/personalized-hint", async (req, res) => {
  const { userQuery, correctQuery } = req.body;

  if (!userQuery || !correctQuery) {
    return res.status(400).json({
      error: "Both userQuery and correctQuery are required.",
    });
  }

  const prompt = `The user wrote the following incorrect SQL query: "${userQuery}". The correct query is: "${correctQuery}". Provide a personalized hint to help the user understand what is wrong with their query and how to fix it under 25 words.`;
  // const prompt = `Generate 4 numbers`;

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B",
      {
        inputs: prompt,
        parameters: { max_length: 50, temperature: 0.7 },
      },
      {
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` },
      }
    );
    console.log(response.data[0].generated_text);
    const generatedText =
      response.data[0].generated_text || "No response generated.";
    res.json({ success: true, response: generatedText.trim() }); // Send only the hint text
  } catch (err) {
    console.error("Error interacting with Hugging Face:", err.message);
    res.status(500).json({ error: "Failed to generate personalized hint." });
  }
});

// app.post("/generate-sql", async (req, res) => {
//   const { prompt } = req.body;

//   if (!prompt) {
//     return res.status(400).json({ error: "Prompt is required." });
//   }

//   try {
//     const response = await axios.post(
//       "https://api-inference.huggingface.co/models/defog/sqlcoder-7b-2",
//       {
//         inputs: prompt,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     res.json({
//       success: true,
//       response: response.data?.generated_text || "No response generated.",
//     });
//   } catch (err) {
//     console.error("Error interacting with Hugging Face:", err.message);
//     res.status(500).json({ error: "Failed to generate SQL." });
//   }
// });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
