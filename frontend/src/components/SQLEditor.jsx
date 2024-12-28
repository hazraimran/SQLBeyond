import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import confetti from "canvas-confetti";
import LeftSidebar from "./Sidebar/LeftSidebar";
import RightSidebar from "./Sidebar/RightSidebar";
import Editor from "./SQLEditorComponents/Editor";
import questions from "../data/questions";
import logToCSV from "../utils/logger";
import "../styles/SQLEditor.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

function SQLEditor() {
  const location = useLocation();
  const savedUserData = JSON.parse(localStorage.getItem("userData")) || {};
  const {
    name = savedUserData.name,
    company = savedUserData.company,
    position = savedUserData.position,
  } = location.state || {};

  // State variables
  const [query, setQuery] = useState(
    "SELECT P.firstName, P.lastName, A.reason, (P.weight / ((P.height / 100) * (P.height / 100))) AS BMI FROM Patient P JOIN Admission A ON P.healthNum = A.pID ORDER BY A.date DESC;"
  );
  const [result, setResult] = useState([]);
  const [tasksCompleted, setTasksCompleted] = useState(1);
  const [correctAnswerResult, setCorrectAnswerResult] = useState(null);
  const [imageState, setImageState] = useState("thinking");
  const [message, setMessage] = useState("");
  const [buttonsDisabled, setButtonsDisabled] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    answer: "",
  });
  const [startTime, setStartTime] = useState(null);
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState(["Query Novice", "JOIN Master"]);
  const [accuracy, setAccuracy] = useState(100);
  const [responseTimes, setResponseTimes] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState("easy");
  const [usedQuestions, setUsedQuestions] = useState({
    easy: [],
    medium: [],
    hard: [],
  });
  const [playerPoints, setPlayerPoints] = useState({
    easy: [],
    medium: [],
    hard: [],
  });
  const [dynamicIdealPoints, setDynamicIdealPoints] = useState([10, 50, 100]);
  const [hasExecuted, setHasExecuted] = useState(false);
  const [errorHint, setErrorHint] = useState(""); // NEW STATE

  const fetchCorrectAnswerResult = useCallback(async (correctQuery) => {
    try {
      const response = await fetch(`${apiUrl}/execute-query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: correctQuery }),
      });
      const data = await response.json();
      return response.ok ? data.results : null;
    } catch (error) {
      console.error("Error fetching correct answer:", error);
      return null;
    }
  }, []);

  const downloadLogs = () => {
    const logs = localStorage.getItem("userLogs");
    const blob = new Blob([logs], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user_logs.csv";
    a.click();
  };

  const calculatePoints = (responseTime) => {
    const { queryExecutionTime, totalTimeToSolve } = currentQuestion.metrics;
    let executionTimePoints = 0;
    let totalSolveTimePoints = 0;

    if (responseTime <= queryExecutionTime.excellent.threshold) {
      executionTimePoints = queryExecutionTime.excellent.points;
    } else if (responseTime <= queryExecutionTime.mediocre.threshold) {
      executionTimePoints = queryExecutionTime.mediocre.points;
    } else {
      executionTimePoints = queryExecutionTime.poor.points;
    }

    if (responseTime <= totalTimeToSolve.excellent.threshold) {
      totalSolveTimePoints = totalTimeToSolve.excellent.points;
    } else if (responseTime <= totalTimeToSolve.mediocre.threshold) {
      totalSolveTimePoints = totalTimeToSolve.mediocre.points;
    } else {
      totalSolveTimePoints = totalTimeToSolve.poor.points;
    }

    return executionTimePoints + totalSolveTimePoints;
  };

  const loadQuestion = useCallback(async () => {
    setImageState("thinking");
    setButtonsDisabled(true);

    const questionList = questions[currentDifficulty];
    const remainingQuestions = questionList.filter(
      (q) => !usedQuestions[currentDifficulty].includes(q.question)
    );

    let selectedQuestion;

    if (remainingQuestions.length > 0) {
      selectedQuestion =
        remainingQuestions[
          Math.floor(Math.random() * remainingQuestions.length)
        ];
      setUsedQuestions((prev) => ({
        ...prev,
        [currentDifficulty]: [
          ...prev[currentDifficulty],
          selectedQuestion.question,
        ],
      }));
    } else {
      setUsedQuestions((prev) => ({ ...prev, [currentDifficulty]: [] }));
      selectedQuestion =
        questionList[Math.floor(Math.random() * questionList.length)];
    }

    if (selectedQuestion) {
      setCurrentQuestion(selectedQuestion);
      setStartTime(Date.now());
      const correctResult = await fetchCorrectAnswerResult(
        selectedQuestion.answer
      );
      setCorrectAnswerResult(correctResult);
      setMessage(`Current Task: ${selectedQuestion.question}`);
      setTimeout(() => setButtonsDisabled(false), 2000);
    }
  }, [currentDifficulty, fetchCorrectAnswerResult, usedQuestions]);

  const saveUserData = async (data) => {
    try {
      await fetch("http://localhost:3000/save-user-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error("Error saving user data:", err);
    }
  };

  const checkAnswer = useCallback(
    async (userResult) => {
      const correct =
        JSON.stringify(userResult) === JSON.stringify(correctAnswerResult);
      const responseTime = (Date.now() - startTime) / 1000;
      setResponseTimes((prev) => [...prev, responseTime]);

      const earnedPoints = correct ? calculatePoints(responseTime) : 0;

      const questionData = {
        userId: "user123",
        question: currentQuestion.question,
        difficulty: currentDifficulty,
        correctAnswer: currentQuestion.answer,
        userAnswerResult: userResult,
        isCorrect: correct,
        timeTaken: responseTime,
        pointsEarned: earnedPoints,
        timestamp: new Date(),
      };

      saveUserData(questionData);

      if (correct) {
        const questionDifficulty = currentQuestion.difficulty;

        setPoints((prevPoints) => prevPoints + earnedPoints);
        setPlayerPoints((prev) => {
          const updatedPoints = { ...prev };
          updatedPoints[questionDifficulty] = [
            ...updatedPoints[questionDifficulty],
            earnedPoints,
          ];
          return updatedPoints;
        });

        if (points + earnedPoints >= 100 && !badges.includes("SQL Expert")) {
          setBadges((prevBadges) => [...prevBadges, "SQL Expert"]);
        }

        const totalPointsInDifficulty = playerPoints[questionDifficulty].reduce(
          (a, b) => a + b,
          0
        );
        const requiredPoints =
          questionDifficulty === "easy"
            ? 30
            : questionDifficulty === "medium"
            ? 50
            : 70;

        if (totalPointsInDifficulty >= requiredPoints) {
          if (questionDifficulty === "easy") {
            setCurrentDifficulty("medium");
            setTimeout(() => loadQuestion(), 0);
          } else if (questionDifficulty === "medium") {
            setCurrentDifficulty("hard");
            setTimeout(() => loadQuestion(), 0);
          }
        } else {
          setTimeout(loadQuestion, 3000);
        }

        setTasksCompleted((prev) => prev + 1);
        setMessage("Good job!");
        triggerConfetti();
      } else {
        setRetryCount((prev) => prev + 1);
        setImageState("sad");
        setMessage("Try again");

        try {
          const res = await fetch("http://localhost:5001/personalized-hint", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userQuery: query,
              correctQuery: currentQuestion.answer,
            }),
          });
          const data = await res.json();

          if (data.success) {
            setErrorHint(data.response);
          } else {
            setMessage("Unable to fetch personalized hint. Try again.");
          }
        } catch (error) {
          console.error("Error fetching personalized hint:", error);
          setMessage("Something went wrong. Please try again.");
        }

        setTimeout(() => {
          setImageState("thinking");
          setMessage(`Current Task: ${currentQuestion.question}`);
        }, 3000);

        if (retryCount >= 3) {
          setAccuracy((prevAccuracy) => Math.max(0, prevAccuracy - 10));
        }
      }
    },
    [
      correctAnswerResult,
      startTime,
      responseTimes,
      accuracy,
      retryCount,
      badges,
      currentDifficulty,
      loadQuestion,
      tasksCompleted,
      currentQuestion,
      calculatePoints,
      playerPoints,
      points,
    ]
  );

  const executeQuery = async (userQuery, limitRows = false) => {
    try {
      const response = await fetch(`${apiUrl}/execute-query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery, limitRows }),
      });

      const data = await response.json();

      if (response.ok) {
        const limitedResult = limitRows
          ? data.results.slice(0, 10)
          : data.results;
        setResult(limitedResult);
      } else {
        setResult([{ error: "Syntax error or invalid query." }]);
        setMessage("Try again");
      }
    } catch (error) {
      console.error("Error:", error);
      setResult([{ error: "Error connecting to server." }]);
      setMessage("Try again");
    }
  };

  // const submitQuery = async (userQuery) => {
  //   try {
  //     const response = await fetch(`${apiUrl}/execute-query`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ query: userQuery }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       setResult(data.results);
  //       checkAnswer(data.results);
  //     } else {
  //       setResult([{ error: "Syntax error or invalid query." }]);
  //       setMessage("Submit failed. Check your query.");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     setResult([{ error: "Error connecting to server." }]);
  //     setMessage("Submit failed.");
  //   }
  // };

  const submitQuery = async (userQuery) => {
    const timestamp = new Date().toISOString();
    try {
      const response = await fetch(`${apiUrl}/execute-query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.results);
        setErrorHint(""); // Clear error when query is correct
        checkAnswer(data.results);
        logToCSV({
          timestamp,
          action: "Query Submitted",
          query: userQuery,
          result: JSON.stringify(data.results),
          status: "Success",
        });
      } else {
        setErrorHint("Your query has a syntax error or is invalid."); // SET ERROR FOR AI ASSISTANT
        logToCSV({
          timestamp,
          action: "Query Submitted",
          query: userQuery,
          result: "Invalid Query",
          status: "Error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorHint("An error occurred while connecting to the server."); // SET ERROR FOR AI ASSISTANT
      logToCSV({
        timestamp,
        action: "Query Submitted",
        query: userQuery,
        result: "Server Error",
        status: "Error",
      });
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  useEffect(() => {
    if (!hasExecuted) {
      setHasExecuted(true);
      const userData = JSON.parse(localStorage.getItem("userData")) || {};
      if (userData.idealSlope) {
        setDynamicIdealPoints([
          userData.idealSlope.easy,
          userData.idealSlope.medium,
          userData.idealSlope.hard,
        ]);
      }

      setMessage(
        `Hi ${name || "User"}, I'm Joe from ${
          company || "your company"
        }, manager for ${
          position || "your position"
        }. Let's start your assessment.`
      );
      setImageState("happy");
      setButtonsDisabled(true);
      setTimeout(loadQuestion, 7000);
    }
  }, [hasExecuted, loadQuestion, name, company, position]);

  return (
    <div className="sql-editor-container">
      <LeftSidebar imageState={imageState} message={message} />
      <div className="main-editor">
        <Editor
          setQuery={(updatedQuery) => setQuery(updatedQuery)}
          query={query}
          executeQuery={(content) => executeQuery(content, true)}
          submitQuery={submitQuery}
          buttonsDisabled={buttonsDisabled}
        />
        <div className="result">
          <button onClick={downloadLogs}>Download Logs</button>

          <h3>Query Result:</h3>
          <div className="table-container">
            {Array.isArray(result) ? (
              <table>
                <thead>
                  <tr>
                    {result.length > 0 &&
                      Object.keys(result[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {result.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, i) => (
                        <td key={i}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <pre>{result}</pre>
            )}
          </div>
        </div>
      </div>

      <RightSidebar
        progress={points}
        setProgress={setPoints}
        query={query}
        taskDescription={currentQuestion}
        retries={retryCount}
        badges={badges}
        pointsData={playerPoints}
        idealPoints={dynamicIdealPoints}
        errorHint={errorHint} // Pass error message to AI Assistant
      />
    </div>
  );
}

export default SQLEditor;
