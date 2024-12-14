// const questions = {
//   easy: [
//     {
//       question: "easy 1 Show all columns from the 'Patient' table.",
//       concepts: ["SELECT", "FROM"],
//       answer: "SELECT * FROM Patient;",
//       difficulty: "easy",
//       expectedResponseTime: 10, // seconds
//       maxRetries: 3,
//       points: 10,
//       penalty: 2, // points deducted per retry
//       concept: "SELECT",
//     },
//     {
//       question: "easy 2 Show all columns from the 'Patient' table.",
//       concepts: ["SELECT", "FROM"],
//       answer: "SELECT * FROM Patient;",
//       difficulty: "easy",
//       expectedResponseTime: 10,
//       maxRetries: 3,
//       points: 10,
//       penalty: 2,
//       concept: "SELECT",
//     },
//     {
//       question: "easy 3 Show all columns from the 'Patient' table.",
//       concepts: ["SELECT", "FROM"],
//       answer: "SELECT * FROM Patient;",
//       difficulty: "easy",
//       expectedResponseTime: 10, // seconds
//       maxRetries: 3,
//       points: 10,
//       penalty: 2, // points deducted per retry
//       concept: "FROM",
//     },
//     {
//       question: "easy 4 Show all columns from the 'Patient' table.",
//       concepts: ["SELECT", "FROM"],
//       answer: "SELECT * FROM Patient;",
//       difficulty: "easy",
//       expectedResponseTime: 1,
//       maxRetries: 3,
//       points: 10,
//       penalty: 2,
//     },
//     {
//       question: "easy 5 Show all columns from the 'Patient' table.",
//       concepts: ["SELECT", "FROM"],
//       answer: "SELECT * FROM Patient;",
//       difficulty: "easy",
//       expectedResponseTime: 1, // seconds
//       maxRetries: 3,
//       points: 10,
//       penalty: 2, // points deducted per retry
//     },
//     {
//       question: "easy 6 Show all columns from the 'Patient' table.",
//       concepts: ["SELECT", "FROM"],
//       answer: "SELECT * FROM Patient;",
//       difficulty: "easy",
//       expectedResponseTime: 1,
//       maxRetries: 3,
//       points: 10,
//       penalty: 2,
//     },
//     // Add more easy questions with the same structure...
//   ],
//   medium: [
//     {
//       question: "medium 1 Show all columns from the 'Patient' table.",
//       concepts: ["SELECT", "FROM"],
//       answer: "SELECT * FROM Patient;",
//       difficulty: "medium",
//       expectedResponseTime: 25, // seconds
//       maxRetries: 2,
//       points: 20,
//       penalty: 5,
//     },
//     {
//       question: "medium 2 Show all columns from the 'Patient' table.",
//       concepts: ["SELECT", "FROM"],
//       answer: "SELECT * FROM Patient;",
//       difficulty: "medium",
//       expectedResponseTime: 25,
//       maxRetries: 2,
//       points: 20,
//       penalty: 5,
//     },
//     {
//       question: "medium 3 Show all columns from the 'Patient' table.",
//       concepts: ["SELECT", "FROM"],
//       answer: "SELECT * FROM Patient;",
//       difficulty: "medium",
//       expectedResponseTime: 25, // seconds
//       maxRetries: 2,
//       points: 20,
//       penalty: 5,
//     },
//     {
//       question: "medium 4 Show all columns from the 'Patient' table.",
//       concepts: ["SELECT", "FROM"],
//       answer: "SELECT * FROM Patient;",
//       difficulty: "medium",
//       expectedResponseTime: 25,
//       maxRetries: 2,
//       points: 20,
//       penalty: 5,
//     },
//     {
//       question: "medium 5 Show all columns from the 'Patient' table.",
//       concepts: ["SELECT", "FROM"],
//       answer: "SELECT * FROM Patient;",
//       difficulty: "medium",
//       expectedResponseTime: 25, // seconds
//       maxRetries: 2,
//       points: 20,
//       penalty: 5,
//     },
//     {
//       question: "medium 6 Show all columns from the 'Patient' table.",
//       concepts: ["SELECT", "FROM"],
//       answer: "SELECT * FROM Patient;",
//       difficulty: "medium",
//       expectedResponseTime: 25,
//       maxRetries: 2,
//       points: 20,
//       penalty: 5,
//     },
//     // Add more medium questions with the same structure...
//   ],
//   hard: [
//     {
//       question: "hard 1 Show all columns from the 'Patient' table.",
//       concepts: ["SELECT", "FROM"],
//       answer: "SELECT * FROM Patient;",
//       difficulty: "hard",
//       expectedResponseTime: 40, // seconds
//       maxRetries: 1,
//       points: 50,
//       penalty: 10,
//     },
//     {
//       question: "hard 2 Show all columns from the 'Patient' table.",
//       concepts: ["SELECT", "FROM"],
//       answer: "SELECT * FROM Patient;",
//       difficulty: "hard",
//       expectedResponseTime: 40,
//       maxRetries: 1,
//       points: 50,
//       penalty: 10,
//     },
//     {
//       question: "hard 3 Show all columns from the 'Patient' table.",
//       concepts: ["SELECT", "FROM"],
//       answer: "SELECT * FROM Patient;",
//       difficulty: "hard",
//       expectedResponseTime: 40, // seconds
//       maxRetries: 1,
//       points: 50,
//       penalty: 10,
//     },
//     {
//       question: "hard 4 Show all columns from the 'Patient' table.",
//       concepts: ["SELECT", "FROM"],
//       answer: "SELECT * FROM Patient;",
//       difficulty: "hard",
//       expectedResponseTime: 40,
//       maxRetries: 1,
//       points: 50,
//       penalty: 10,
//     },
//     {
//       question: "hard 5 Show all columns from the 'Patient' table.",
//       concepts: ["SELECT", "FROM"],
//       answer: "SELECT * FROM Patient;",
//       difficulty: "hard",
//       expectedResponseTime: 40, // seconds
//       maxRetries: 1,
//       points: 50,
//       penalty: 10,
//     },
//     {
//       question: "hard 6 Show all columns from the 'Patient' table.",
//       concepts: ["SELECT", "FROM"],
//       answer: "SELECT * FROM Patient;",
//       difficulty: "hard",
//       expectedResponseTime: 40,
//       maxRetries: 1,
//       points: 50,
//       penalty: 10,
//     },
//     // Add more hard questions with the same structure...
//   ],
// };

// export default questions;

// const questions = {
//   easy: [
//     {
//       question: "easy 1 Show all columns from the 'Patient' table.",
//       concepts: ["SELECT", "FROM"],
//       answer: "SELECT * FROM Patient;",
//       difficulty: "easy",
//       expectedResponseTime: 10, // seconds
//       maxRetries: 3,
//       points: 10,
//       penalty: 2, // points deducted per retry
//       metrics: {
//         queryExecutionTime: {
//           excellent: { threshold: 7, points: 10 },
//           mediocre: { threshold: 10, points: 5 },
//           poor: { threshold: Infinity, points: 0 },
//         },
//         retries: {
//           excellent: { threshold: 0, points: 10 },
//           mediocre: { threshold: 1, points: 5 },
//           poor: { threshold: Infinity, points: 0 },
//         },
//         hintsUsed: {
//           excellent: { threshold: 0, points: 10 },
//           mediocre: { threshold: 1, points: 5 },
//           poor: { threshold: Infinity, points: 0 },
//         },
//         codeEfficiency: {
//           excellent: { level: "Optimized", points: 10 },
//           mediocre: { level: "Acceptable", points: 5 },
//           poor: { level: "Inefficient", points: 0 },
//         },
//       },
//     },
//     {
//       question: "easy 2 Show all columns from the 'Patient' table.",
//       concepts: ["SELECT", "FROM"],
//       answer: "SELECT * FROM Patient;",
//       difficulty: "easy",
//       expectedResponseTime: 10,
//       maxRetries: 3,
//       points: 10,
//       penalty: 2,
//       metrics: {
//         queryExecutionTime: {
//           excellent: { threshold: 7, points: 10 },
//           mediocre: { threshold: 10, points: 5 },
//           poor: { threshold: Infinity, points: 0 },
//         },
//         retries: {
//           excellent: { threshold: 0, points: 10 },
//           mediocre: { threshold: 1, points: 5 },
//           poor: { threshold: Infinity, points: 0 },
//         },
//         hintsUsed: {
//           excellent: { threshold: 0, points: 10 },
//           mediocre: { threshold: 1, points: 5 },
//           poor: { threshold: Infinity, points: 0 },
//         },
//         codeEfficiency: {
//           excellent: { level: "Optimized", points: 10 },
//           mediocre: { level: "Acceptable", points: 5 },
//           poor: { level: "Inefficient", points: 0 },
//         },
//       },
//     },
//   ],
//   medium: [
//     {
//       question: "medium 1 Show all columns from the 'Patient' table.",
//       concepts: ["SELECT", "FROM"],
//       answer: "SELECT * FROM Patient;",
//       difficulty: "medium",
//       expectedResponseTime: 25, // seconds
//       maxRetries: 2,
//       points: 20,
//       penalty: 5,
//       metrics: {
//         queryExecutionTime: {
//           excellent: { threshold: 20, points: 10 },
//           mediocre: { threshold: 25, points: 5 },
//           poor: { threshold: Infinity, points: 0 },
//         },
//         retries: {
//           excellent: { threshold: 0, points: 10 },
//           mediocre: { threshold: 1, points: 5 },
//           poor: { threshold: Infinity, points: 0 },
//         },
//         hintsUsed: {
//           excellent: { threshold: 0, points: 10 },
//           mediocre: { threshold: 1, points: 5 },
//           poor: { threshold: Infinity, points: 0 },
//         },
//         codeEfficiency: {
//           excellent: { level: "Optimized", points: 10 },
//           mediocre: { level: "Acceptable", points: 5 },
//           poor: { level: "Inefficient", points: 0 },
//         },
//       },
//     },
//   ],
//   hard: [
//     {
//       question: "hard 1 Show all columns from the 'Patient' table.",
//       concepts: ["SELECT", "FROM"],
//       answer: "SELECT * FROM Patient;",
//       difficulty: "hard",
//       expectedResponseTime: 40, // seconds
//       maxRetries: 1,
//       points: 50,
//       penalty: 10,
//       metrics: {
//         queryExecutionTime: {
//           excellent: { threshold: 30, points: 10 },
//           mediocre: { threshold: 40, points: 5 },
//           poor: { threshold: Infinity, points: 0 },
//         },
//         retries: {
//           excellent: { threshold: 0, points: 10 },
//           mediocre: { threshold: 1, points: 5 },
//           poor: { threshold: Infinity, points: 0 },
//         },
//         hintsUsed: {
//           excellent: { threshold: 0, points: 10 },
//           mediocre: { threshold: 1, points: 5 },
//           poor: { threshold: Infinity, points: 0 },
//         },
//         codeEfficiency: {
//           excellent: { level: "Optimized", points: 10 },
//           mediocre: { level: "Acceptable", points: 5 },
//           poor: { level: "Inefficient", points: 0 },
//         },
//       },
//     },
//   ],
// };

// export default questions;

const questions = {
  easy: [
    {
      question: "easy 1 Show all columns from the 'Patient' table.",
      concepts: ["SELECT", "FROM"],
      answer: "SELECT * FROM Patient;",
      difficulty: "easy",
      expectedResponseTime: 10, // seconds
      maxRetries: 3,
      points: 10,
      penalty: 2, // points deducted per retry
      metrics: {
        queryExecutionTime: {
          excellent: { threshold: 7, points: 10 },
          mediocre: { threshold: 10, points: 5 },
          poor: { threshold: Infinity, points: 0 },
        },
        retries: {
          excellent: { threshold: 0, points: 10 },
          mediocre: { threshold: 1, points: 5 },
          poor: { threshold: Infinity, points: 0 },
        },
        hintsUsed: {
          excellent: { threshold: 0, points: 10 },
          mediocre: { threshold: 1, points: 5 },
          poor: { threshold: Infinity, points: 0 },
        },
        codeEfficiency: {
          excellent: { level: "Optimized", points: 10 },
          mediocre: { level: "Acceptable", points: 5 },
          poor: { level: "Inefficient", points: 0 },
        },
        totalTimeToSolve: {
          excellent: { threshold: 8, points: 10 }, // seconds
          mediocre: { threshold: 12, points: 5 },
          poor: { threshold: Infinity, points: 0 },
        },
      },
    },
    {
      question: "easy 2 Show all columns from the 'Patient' table.",
      concepts: ["SELECT", "FROM"],
      answer: "SELECT * FROM Patient;",
      difficulty: "easy",
      expectedResponseTime: 10,
      maxRetries: 3,
      points: 10,
      penalty: 2,
      metrics: {
        queryExecutionTime: {
          excellent: { threshold: 7, points: 10 },
          mediocre: { threshold: 10, points: 5 },
          poor: { threshold: Infinity, points: 0 },
        },
        retries: {
          excellent: { threshold: 0, points: 10 },
          mediocre: { threshold: 1, points: 5 },
          poor: { threshold: Infinity, points: 0 },
        },
        hintsUsed: {
          excellent: { threshold: 0, points: 10 },
          mediocre: { threshold: 1, points: 5 },
          poor: { threshold: Infinity, points: 0 },
        },
        codeEfficiency: {
          excellent: { level: "Optimized", points: 10 },
          mediocre: { level: "Acceptable", points: 5 },
          poor: { level: "Inefficient", points: 0 },
        },
        totalTimeToSolve: {
          excellent: { threshold: 8, points: 10 }, // seconds
          mediocre: { threshold: 12, points: 5 },
          poor: { threshold: Infinity, points: 0 },
        },
      },
    },
  ],
  medium: [
    {
      question: "medium 1 Show all columns from the 'Patient' table.",
      concepts: ["SELECT", "FROM"],
      answer: "SELECT * FROM Patient;",
      difficulty: "medium",
      expectedResponseTime: 25, // seconds
      maxRetries: 2,
      points: 20,
      penalty: 5,
      metrics: {
        queryExecutionTime: {
          excellent: { threshold: 20, points: 10 },
          mediocre: { threshold: 25, points: 5 },
          poor: { threshold: Infinity, points: 0 },
        },
        retries: {
          excellent: { threshold: 0, points: 10 },
          mediocre: { threshold: 1, points: 5 },
          poor: { threshold: Infinity, points: 0 },
        },
        hintsUsed: {
          excellent: { threshold: 0, points: 10 },
          mediocre: { threshold: 1, points: 5 },
          poor: { threshold: Infinity, points: 0 },
        },
        codeEfficiency: {
          excellent: { level: "Optimized", points: 10 },
          mediocre: { level: "Acceptable", points: 5 },
          poor: { level: "Inefficient", points: 0 },
        },
        totalTimeToSolve: {
          excellent: { threshold: 22, points: 10 }, // seconds
          mediocre: { threshold: 28, points: 5 },
          poor: { threshold: Infinity, points: 0 },
        },
      },
    },
  ],
  hard: [
    {
      question: "hard 1 Show all columns from the 'Patient' table.",
      concepts: ["SELECT", "FROM"],
      answer: "SELECT * FROM Patient;",
      difficulty: "hard",
      expectedResponseTime: 40, // seconds
      maxRetries: 1,
      points: 50,
      penalty: 10,
      metrics: {
        queryExecutionTime: {
          excellent: { threshold: 30, points: 10 },
          mediocre: { threshold: 40, points: 5 },
          poor: { threshold: Infinity, points: 0 },
        },
        retries: {
          excellent: { threshold: 0, points: 10 },
          mediocre: { threshold: 1, points: 5 },
          poor: { threshold: Infinity, points: 0 },
        },
        hintsUsed: {
          excellent: { threshold: 0, points: 10 },
          mediocre: { threshold: 1, points: 5 },
          poor: { threshold: Infinity, points: 0 },
        },
        codeEfficiency: {
          excellent: { level: "Optimized", points: 10 },
          mediocre: { level: "Acceptable", points: 5 },
          poor: { level: "Inefficient", points: 0 },
        },
        totalTimeToSolve: {
          excellent: { threshold: 35, points: 10 }, // seconds
          mediocre: { threshold: 45, points: 5 },
          poor: { threshold: Infinity, points: 0 },
        },
      },
    },
  ],
};

export default questions;
