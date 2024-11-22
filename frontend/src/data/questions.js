const questions = {
  Select: {
    easy: [
      {
        question: "Show all columns from the 'Patient' table.",
        concepts: ["SELECT", "FROM"],
        answer: "SELECT * FROM Patient;",
      },
      {
        question: "List all first names of patients.",
        concepts: ["SELECT", "FROM"],
        answer: "SELECT firstName FROM Patient;",
      },
      // {
      //   question: "Retrieve the last names of all doctors.",
      //   concepts: ["SELECT", "FROM"],
      //   answer: "SELECT lastName FROM Employee;",
      // },
      {
        question: "Display the descriptions of all test types.",
        concepts: ["SELECT", "FROM"],
        answer: "SELECT description FROM TestType;",
      },
      {
        question: "Display the names of patients along with their birth dates.",
        concepts: ["SELECT", "FROM"],
        answer: "SELECT firstName, lastName, dateOfBirth FROM Patient;",
      },
    ],
    medium: [
      {
        question:
          "Retrieve the full name of each patient by combining first and last names.",
        concepts: ["SELECT", "CONCAT", "FROM"],
        answer:
          "SELECT CONCAT(firstName, ' ', lastName) AS fullName FROM Patient;",
      },
      // {
      //   question: "Show each patient’s full name and height.",
      //   concepts: ["SELECT"],
      //   answer:
      //     "SELECT CONCAT(firstName, ' ', lastName) AS fullName, height FROM Patient;",
      // },
      // {
      //   question:
      //     "List patients along with their doctor’s specialty for each admission.",
      //   concepts: ["SELECT", "JOIN"],
      //   answer:
      //     "SELECT p.firstName, p.lastName, d.specialty FROM Admission a JOIN Patient p ON a.pID = p.healthNum JOIN Doctor d ON a.doctorID = d.eID;",
      // },
      // {
      //   question:
      //     "Retrieve all unique training levels recorded in the 'Technician' table.",
      //   concepts: ["SELECT", "DISTINCT", "FROM"],
      //   answer: "SELECT DISTINCT trainingLevel FROM Technician;",
      // },
      // {
      //   question:
      //     "Display each patient's first name and their attending doctor's last name.",
      //   concepts: ["SELECT", "JOIN"],
      //   answer:
      //     "SELECT p.firstName, d.lastName FROM Patient p JOIN Admission a ON p.healthNum = a.pID JOIN Doctor d ON a.doctorID = d.eID;",
      // },
    ],
    hard: [
      {
        question:
          "List unique first and last names of patients who have been admitted under multiple doctors.",
        concepts: ["SELECT", "DISTINCT", "JOIN", "GROUP BY", "HAVING"],
        answer:
          "SELECT DISTINCT p.firstName, p.lastName FROM Patient p JOIN Admission a ON p.healthNum = a.pID GROUP BY p.healthNum HAVING COUNT(DISTINCT a.doctorID) > 1;",
      },
      // {
      //   question:
      //     "Select all patients who have prescriptions from doctors specializing in more than one field.",
      //   concepts: ["SELECT", "JOIN", "GROUP BY", "HAVING"],
      //   answer:
      //     "SELECT p.firstName, p.lastName FROM Patient p JOIN Prescription pr ON p.healthNum = pr.pID JOIN Doctor d ON pr.doctorID = d.eID GROUP BY p.healthNum HAVING COUNT(DISTINCT d.specialty) > 1;",
      // },
      // {
      //   question:
      //     "Display all patients along with their respective doctor’s specialty for each admission.",
      //   concepts: ["SELECT", "JOIN"],
      //   answer:
      //     "SELECT p.firstName, p.lastName, d.specialty FROM Admission a JOIN Patient p ON a.pID = p.healthNum JOIN Doctor d ON a.doctorID = d.eID;",
      // },
      // {
      //   question:
      //     "Retrieve the total number of patients who have more than one recorded admission.",
      //   concepts: ["SELECT", "COUNT", "GROUP BY", "HAVING"],
      //   answer:
      //     "SELECT COUNT(*) FROM Admission GROUP BY pID HAVING COUNT(date) > 1;",
      // },
      // {
      //   question:
      //     "List all patients who have been treated by doctors from different specialties.",
      //   concepts: ["SELECT", "JOIN", "DISTINCT", "GROUP BY", "HAVING"],
      //   answer:
      //     "SELECT p.firstName, p.lastName FROM Patient p JOIN Admission a ON p.healthNum = a.pID JOIN Doctor d ON a.doctorID = d.eID GROUP BY p.healthNum HAVING COUNT(DISTINCT d.specialty) > 1;",
      // },
    ],
  },
  // Continue similarly for other categories like "From", "Where", "Distinct", "Group By"
};

export default questions;
