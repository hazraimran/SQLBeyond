import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

const quiz = {
  totalQuestions: 8,
  perQuestionScore: 5,
  questions: [
    {
      question: "Which SQL statement is used to retrieve data from a database?",
      choices: ["SELECT", "GET", "FETCH", "RETRIEVE"],
      correctAnswer: "SELECT",
    },
    {
      question: "Which clause is used to filter records in SQL?",
      choices: ["WHERE", "FILTER", "GROUP BY", "ORDER BY"],
      correctAnswer: "WHERE",
    },
    {
      question: "How do you sort results in ascending order in SQL?",
      choices: ["ORDER BY ASC", "SORT ASC", "ASCENDING", "SORT BY ASC"],
      correctAnswer: "ORDER BY ASC",
    },
    {
      question: "Which SQL statement is used to insert new data into a table?",
      choices: ["INSERT INTO", "ADD INTO", "INSERT NEW", "ADD RECORD"],
      correctAnswer: "INSERT INTO",
    },
    {
      question: "What SQL keyword removes duplicates from results?",
      choices: ["DISTINCT", "UNIQUE", "DELETE", "CLEAN"],
      correctAnswer: "DISTINCT",
    },
    {
      question: "Which SQL statement is used to update existing records?",
      choices: ["UPDATE", "MODIFY", "ALTER", "CHANGE"],
      correctAnswer: "UPDATE",
    },
    {
      question: "What SQL clause is used to group rows based on column values?",
      choices: ["GROUP BY", "ORDER BY", "PARTITION", "MERGE"],
      correctAnswer: "GROUP BY",
    },
    {
      question: "How do you delete all rows from a table?",
      choices: ["DELETE FROM", "TRUNCATE TABLE", "DROP TABLE", "REMOVE TABLE"],
      correctAnswer: "TRUNCATE TABLE",
    },
  ],
};

function mapInitialScoreToStartingPoint(score, maxScore) {
  if (score <= 0.25 * maxScore) return 0.3; // Slightly higher starting point
  else if (score <= 0.5 * maxScore) return 0.5; // Adjusted slope
  else if (score <= 0.75 * maxScore) return 0.7;
  return 0.9; // More refined slope
}

function QuestionaireForUsers() {
  const navigate = useNavigate();
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });

  const { questions } = quiz;
  const maxScore = questions.length * quiz.perQuestionScore;

  const onClickNext = () => {
    setResult((prev) =>
      selectedAnswer === questions[activeQuestion].correctAnswer
        ? {
            ...prev,
            score: prev.score + quiz.perQuestionScore,
            correctAnswers: prev.correctAnswers + 1,
          }
        : { ...prev, wrongAnswers: prev.wrongAnswers + 1 }
    );

    if (activeQuestion < questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
      setSelectedAnswer("");
    } else {
      setShowResult(true);
    }
  };

  const onAnswerSelected = (answer) => {
    setSelectedAnswer(answer);
  };

  const saveQuizSummary = async () => {
    const quizData = {
      userId: "user123", // Replace with dynamic user ID
      questionDetails: questions.map((q) => ({
        question: q.question,
        correctAnswer: q.correctAnswer,
      })),
      timeTaken: 120, // Replace with actual total time
      score: result.score,
      correctAnswers: result.correctAnswers,
      wrongAnswers: result.wrongAnswers,
    };

    try {
      await fetch("http://localhost:3000/save-user-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizData),
      });
    } catch (err) {
      console.error("Error saving quiz summary:", err);
    }
  };

  const continueToSQL = () => {
    const initialPerformance = mapInitialScoreToStartingPoint(
      result.score,
      maxScore
    );

    // // Dynamically adjust ideal points for slopes
    // const idealSlope = {
    //   easy: Math.round(40 + initialPerformance * 15), // Adjusted dynamically
    //   medium: Math.round(60 + initialPerformance * 25),
    //   hard: Math.round(120 + initialPerformance * 30),
    // };
    const idealSlope = {
      easy: Math.round(10 + initialPerformance * 10), // Adjusted dynamically
      medium: Math.round(10 + initialPerformance * 20),
      hard: Math.round(10 + initialPerformance * 30),
    };
    console.log(initialPerformance);
    console.log(idealSlope);
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    localStorage.setItem(
      "userData",
      JSON.stringify({ ...userData, idealSlope })
    );
    saveQuizSummary();
    navigate("/SQLEditor");
  };

  return (
    <div className="quiz-container">
      {!showResult ? (
        <div>
          <h2>{questions[activeQuestion].question}</h2>
          <ul>
            {questions[activeQuestion].choices.map((choice, index) => (
              <li
                key={index}
                onClick={() => onAnswerSelected(choice)}
                className={selectedAnswer === choice ? "selected-answer" : null}
              >
                {choice}
              </li>
            ))}
          </ul>
          <button onClick={onClickNext} disabled={!selectedAnswer}>
            {activeQuestion === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      ) : (
        <div className="result">
          <h3>Quiz Completed</h3>
          <p>Total Questions: {questions.length}</p>
          <p>Score: {result.score}</p>
          <p>Correct Answers: {result.correctAnswers}</p>
          <p>Wrong Answers: {result.wrongAnswers}</p>
          <button onClick={continueToSQL}>Continue to SQL Practice</button>
        </div>
      )}
    </div>
  );
}

export default QuestionaireForUsers;
