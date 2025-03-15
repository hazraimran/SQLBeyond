const questions = {
  easy: [
    {
      question: "Retrieve all technicians with trainingLevel 'Advanced'.",
      answer: "SELECT * FROM Technician WHERE trainingLevel = 'Advanced';",
      difficulty: "easy",
      concepts: ["SELECT", "WHERE"],
      points: 20,
    },
    {
      question:
        "List all technicians ordered by their endDate in descending order.",
      answer: "SELECT * FROM Technician ORDER BY endDate DESC;",
      difficulty: "easy",
      concepts: ["ORDER BY"],
      points: 20,
    },
  ],
  medium: [
    {
      question: "Retrieve the average tID from the Technician table.",
      answer: "SELECT AVG(tID) FROM Technician;",
      difficulty: "medium",
      concepts: ["AVG()"],
      points: 20,
      expectedOutput: [],
    },
    {
      question:
        "List each trainingLevel and the count of technicians in that level.",
      answer:
        "SELECT trainingLevel, COUNT(*) FROM Technician GROUP BY trainingLevel;",
      difficulty: "medium",
      concepts: ["GROUP BY", "COUNT()"],
      points: 20,
      expectedOutput: [],
    },
  ],
  hard: [
    {
      question:
        "Find all technicians who started before 2015 but ended after 2020.",
      answer:
        "SELECT * FROM Technician WHERE startDate < '2015-01-01' AND endDate > '2020-01-01';",
      difficulty: "hard",
      concepts: ["WHERE", "AND", "Dates"],
      points: 20,
      expectedOutput: [],
    },
    {
      question:
        "Retrieve all technicians who do not have 'Advanced' trainingLevel.",
      answer: "SELECT * FROM Technician WHERE trainingLevel <> 'Advanced';",
      difficulty: "hard",
      concepts: ["WHERE", "<>"],
      points: 20,
      expectedOutput: [],
    },
  ],
};

export default questions;
