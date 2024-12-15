const mysql = require("mysql2/promise"); // Use promise-based MySQL
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

//import the account router 
const accountRouter = require('./routes/account');
const cookieParser = require("cookie-parser");

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
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Express cookie-parser - cors was changed as well
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

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

// // Route to handle generating SQL query using Hugging Face
// app.post("/generate-sql", async (req, res) => {
//   const { question } = req.body;

//   if (!question) {
//     return res.status(400).json({ error: "Question is required." });
//   }

//   try {
//     const response = await axios.post(
//       "https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B", // Replace with your desired Hugging Face model
//       {
//         inputs: question,
//         parameters: { max_length: 150, temperature: 0.7 },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
//         },
//       }
//     );

//     console.log("Hugging Face Response:", response.data);

//     res.json({
//       success: true,
//       query:
//         response.data.generated_text ||
//         response.data[0]?.generated_text ||
//         "No query generated.",
//     });
//   } catch (err) {
//     console.error(
//       "Error interacting with Hugging Face:",
//       err.response?.data || err.message
//     );
//     res
//       .status(500)
//       .json({ success: false, error: "Failed to generate SQL query." });
//   }
// });

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

// app.post("/generate-sql", async (req, res) => {
//   const { prompt } = req.body;

//   if (!prompt) {
//     return res.status(400).json({ error: "Prompt is required." });
//   }
//   console.log(prompt);
//   try {
//     const response = await axios.post(
//       "https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B",
//       {
//         inputs: prompt,
//         parameters: { max_length: 50, temperature: 0.7 },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
//         },
//       }
//     );

//     res.json({
//       success: true,
//       response:
//         response.data.generated_text ||
//         response.data[0]?.generated_text ||
//         "No response generated.",
//     });
//   } catch (err) {
//     console.error("Error interacting with Hugging Face:", err.message);
//     res.status(500).json({ error: "Failed to generate SQL." });
//   }
// });

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

// ---------------------- login -------------------
// account route (developed in the routes/account.js)
app.use("/account", accountRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
