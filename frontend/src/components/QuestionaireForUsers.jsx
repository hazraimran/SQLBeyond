import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";

const quiz = {
  totalQuestions: 4,
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
  ],
};

function mapInitialScoreToStartingPoint(score, maxScore) {
  if (score <= 0.25 * maxScore) return 0.2;
  else if (score <= 0.5 * maxScore) return 0.4;
  else if (score <= 0.75 * maxScore) return 0.6;
  return 0.8;
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

  const continueToSQL = () => {
    const initialPerformance = mapInitialScoreToStartingPoint(
      result.score,
      maxScore
    );
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    localStorage.setItem(
      "userData",
      JSON.stringify({ ...userData, initialPerformance })
    );
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
