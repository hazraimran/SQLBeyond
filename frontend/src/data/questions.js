const questions = {
  easy: [
    {
      question:
        "easy 1 Retrieve the full names (firstName, lastName), admission reason, and calculate BMI (weight in kg / (height in meters squared)) for all admitted patients sorted by admission date in descending order.",
      concepts: ["SELECT", "FROM", "JOIN", "ORDER BY", "AS"], // Concepts for S1
      columnNames: [
        "firstName",
        "lastName",
        "reason",
        "height",
        "weight",
        "date",
      ], // Columns for S1
      hints: {
        metaphor:
          "Think of JOIN as connecting two puzzle pieces (Patient and Admission tables). You need to specify how they fit together. ORDER BY is like arranging books on a shelf by date or name. You need to decide the order of your results.", // Hint for S2
        english:
          "Your query should retrieve the first and last names of all admitted patients, along with the reason for admission and their BMI. It should sort the results by admission date in descending order.", // Hint for S3
      },
      answer:
        "SELECT P.firstName, P.lastName, A.reason, (P.weight / ((P.height / 100) * (P.height / 100))) AS BMI FROM Patient P JOIN Admission A ON P.healthNum = A.pID ORDER BY A.date DESC;",
      difficulty: "easy",
      expectedResponseTime: 50, // seconds
      maxRetries: 2,
      points: 30,
      penalty: 10, // Points deducted per retry
      metrics: {
        queryExecutionTime: {
          excellent: { threshold: 45, points: 10 },
          mediocre: { threshold: 50, points: 5 },
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
          excellent: { threshold: 45, points: 10 }, // seconds
          mediocre: { threshold: 55, points: 5 },
          poor: { threshold: Infinity, points: 0 },
        },
      },
    },
    {
      question:
        "easy 2 Retrieve the full names (firstName, lastName), admission reason, and calculate BMI (weight in kg / (height in meters squared)) for all admitted patients sorted by admission date in descending order.",
      concepts: ["SELECT", "FROM", "JOIN", "ORDER BY", "AS"], // Concepts for S1
      columnNames: [
        "firstName",
        "lastName",
        "reason",
        "height",
        "weight",
        "date",
      ], // Columns for S1
      hints: {
        metaphor:
          "Think of JOIN as connecting two puzzle pieces (Patient and Admission tables). You need to specify how they fit together. ORDER BY is like arranging books on a shelf by date or name. You need to decide the order of your results.", // Hint for S2
        english:
          "Your query should retrieve the first and last names of all admitted patients, along with the reason for admission and their BMI. It should sort the results by admission date in descending order.", // Hint for S3
      },
      answer:
        "SELECT P.firstName, P.lastName, A.reason, (P.weight / ((P.height / 100) * (P.height / 100))) AS BMI FROM Patient P JOIN Admission A ON P.healthNum = A.pID ORDER BY A.date DESC;",
      difficulty: "easy",
      expectedResponseTime: 50, // seconds
      maxRetries: 2,
      points: 30,
      penalty: 10, // Points deducted per retry
      metrics: {
        queryExecutionTime: {
          excellent: { threshold: 45, points: 10 },
          mediocre: { threshold: 50, points: 5 },
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
          excellent: { threshold: 45, points: 10 }, // seconds
          mediocre: { threshold: 55, points: 5 },
          poor: { threshold: Infinity, points: 0 },
        },
      },
    },
    {
      question:
        "easy 3 Retrieve the full names (firstName, lastName), admission reason, and calculate BMI (weight in kg / (height in meters squared)) for all admitted patients sorted by admission date in descending order.",
      concepts: ["SELECT", "FROM", "JOIN", "ORDER BY", "AS"], // Concepts for S1
      columnNames: [
        "firstName",
        "lastName",
        "reason",
        "height",
        "weight",
        "date",
      ], // Columns for S1
      hints: {
        metaphor:
          "Think of JOIN as connecting two puzzle pieces (Patient and Admission tables). You need to specify how they fit together. ORDER BY is like arranging books on a shelf by date or name. You need to decide the order of your results.", // Hint for S2
        english:
          "Your query should retrieve the first and last names of all admitted patients, along with the reason for admission and their BMI. It should sort the results by admission date in descending order.", // Hint for S3
      },
      answer:
        "SELECT P.firstName, P.lastName, A.reason, (P.weight / ((P.height / 100) * (P.height / 100))) AS BMI FROM Patient P JOIN Admission A ON P.healthNum = A.pID ORDER BY A.date DESC;",
      difficulty: "easy",
      expectedResponseTime: 50, // seconds
      maxRetries: 2,
      points: 30,
      penalty: 10, // Points deducted per retry
      metrics: {
        queryExecutionTime: {
          excellent: { threshold: 45, points: 10 },
          mediocre: { threshold: 50, points: 5 },
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
          excellent: { threshold: 45, points: 10 }, // seconds
          mediocre: { threshold: 55, points: 5 },
          poor: { threshold: Infinity, points: 0 },
        },
      },
    },
  ],
  medium: [
    {
      question:
        "medium 1 Retrieve the firstName, lastName, and the total number of admissions for each patient.",
      concepts: ["SELECT", "FROM", "JOIN", "GROUP BY", "COUNT"], // Concepts for S1
      columnNames: ["firstName", "lastName", "admissions"], // Columns for S1
      hints: {
        metaphor:
          "Think of COUNT as tallying up the number of items in a list. GROUP BY organizes similar items into buckets before counting.",
        english:
          "Your query should retrieve the first and last names of patients, along with the total number of admissions for each patient. Use GROUP BY to group patients and COUNT to tally their admissions.",
      },
      answer:
        "SELECT P.firstName, P.lastName, COUNT(A.pID) AS admissions FROM Patient P JOIN Admission A ON P.healthNum = A.pID GROUP BY P.firstName, P.lastName;",
      difficulty: "medium",
      expectedResponseTime: 60,
      maxRetries: 2,
      points: 50,
      penalty: 15,
      metrics: {
        queryExecutionTime: {
          excellent: { threshold: 50, points: 10 },
          mediocre: { threshold: 60, points: 5 },
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
          excellent: { threshold: 55, points: 10 },
          mediocre: { threshold: 65, points: 5 },
          poor: { threshold: Infinity, points: 0 },
        },
      },
    },
    {
      question:
        "medium 2 Retrieve the firstName, lastName, and the total number of admissions for each patient.",
      concepts: ["SELECT", "FROM", "JOIN", "GROUP BY", "COUNT"], // Concepts for S1
      columnNames: ["firstName", "lastName", "admissions"], // Columns for S1
      hints: {
        metaphor:
          "Think of COUNT as tallying up the number of items in a list. GROUP BY organizes similar items into buckets before counting.",
        english:
          "Your query should retrieve the first and last names of patients, along with the total number of admissions for each patient. Use GROUP BY to group patients and COUNT to tally their admissions.",
      },
      answer:
        "SELECT P.firstName, P.lastName, COUNT(A.pID) AS admissions FROM Patient P JOIN Admission A ON P.healthNum = A.pID GROUP BY P.firstName, P.lastName;",
      difficulty: "medium",
      expectedResponseTime: 60,
      maxRetries: 2,
      points: 50,
      penalty: 15,
      metrics: {
        queryExecutionTime: {
          excellent: { threshold: 50, points: 10 },
          mediocre: { threshold: 60, points: 5 },
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
          excellent: { threshold: 55, points: 10 },
          mediocre: { threshold: 65, points: 5 },
          poor: { threshold: Infinity, points: 0 },
        },
      },
    },
    {
      question:
        "medium 3 Retrieve the firstName, lastName, and the total number of admissions for each patient.",
      concepts: ["SELECT", "FROM", "JOIN", "GROUP BY", "COUNT"], // Concepts for S1
      columnNames: ["firstName", "lastName", "admissions"], // Columns for S1
      hints: {
        metaphor:
          "Think of COUNT as tallying up the number of items in a list. GROUP BY organizes similar items into buckets before counting.",
        english:
          "Your query should retrieve the first and last names of patients, along with the total number of admissions for each patient. Use GROUP BY to group patients and COUNT to tally their admissions.",
      },
      answer:
        "SELECT P.firstName, P.lastName, COUNT(A.pID) AS admissions FROM Patient P JOIN Admission A ON P.healthNum = A.pID GROUP BY P.firstName, P.lastName;",
      difficulty: "medium",
      expectedResponseTime: 60,
      maxRetries: 2,
      points: 50,
      penalty: 15,
      metrics: {
        queryExecutionTime: {
          excellent: { threshold: 50, points: 10 },
          mediocre: { threshold: 60, points: 5 },
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
          excellent: { threshold: 55, points: 10 },
          mediocre: { threshold: 65, points: 5 },
          poor: { threshold: Infinity, points: 0 },
        },
      },
    },
  ],
  hard: [
    {
      question:
        "hard 1 Retrieve the firstName, lastName, and calculate the average BMI for each doctor’s patients.",
      concepts: ["SELECT", "FROM", "JOIN", "GROUP BY", "AVG", "AS"], // Concepts for S1
      columnNames: ["firstName", "lastName", "averageBMI"], // Columns for S1
      hints: {
        metaphor:
          "AVG is like finding the average score of a class. GROUP BY organizes patients by doctor, and AVG calculates the average BMI for each group.",
        english:
          "Your query should retrieve the first and last names of doctors, along with the average BMI of their patients. Use GROUP BY to group patients by their doctors and AVG to calculate the average BMI.",
      },
      answer:
        "SELECT D.firstName, D.lastName, AVG(P.weight / ((P.height / 100) * (P.height / 100))) AS averageBMI FROM Doctor D JOIN Admission A ON D.eID = A.doctorID JOIN Patient P ON A.pID = P.healthNum GROUP BY D.firstName, D.lastName;",
      difficulty: "hard",
      expectedResponseTime: 90,
      maxRetries: 1,
      points: 100,
      penalty: 25,
      metrics: {
        queryExecutionTime: {
          excellent: { threshold: 80, points: 20 },
          mediocre: { threshold: 90, points: 10 },
          poor: { threshold: Infinity, points: 0 },
        },
        retries: {
          excellent: { threshold: 0, points: 20 },
          mediocre: { threshold: 1, points: 10 },
          poor: { threshold: Infinity, points: 0 },
        },
        hintsUsed: {
          excellent: { threshold: 0, points: 20 },
          mediocre: { threshold: 1, points: 10 },
          poor: { threshold: Infinity, points: 0 },
        },
        codeEfficiency: {
          excellent: { level: "Optimized", points: 20 },
          mediocre: { level: "Acceptable", points: 10 },
          poor: { level: "Inefficient", points: 0 },
        },
        totalTimeToSolve: {
          excellent: { threshold: 85, points: 20 },
          mediocre: { threshold: 95, points: 10 },
          poor: { threshold: Infinity, points: 0 },
        },
      },
    },
  ],
};

export default questions;
