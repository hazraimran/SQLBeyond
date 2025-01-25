import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import confetti from "canvas-confetti";
import LeftSidebar from "./Sidebar/LeftSidebar";
import RightSidebar from "./Sidebar/RightSidebar";
import Editor from "./SQLEditorComponents/Editor";
import BadgeModal from "./BadgeModal";
import questions from "../data/questions";
import badgesData from "../data/badges";
import logToCSV from "../utils/logger";
import "../styles/SQLEditor.css";

import { useAuth } from "./Login/AuthContext";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

function SQLEditor() {
  const location = useLocation();
  const savedUserData = JSON.parse(localStorage.getItem("userData")) || {};
  const user = useAuth().user;

  const {
    name = `${user.firstName} ${user.lastName}`,
    company = savedUserData.company,
    position = savedUserData.position,
  } = location.state || {};

  // State variables
  const [query, setQuery] = useState(
    "SELECT P.firstName, P.lastName, A.reason, (P.weight / ((P.height / 100) * (P.height / 100))) AS BMI FROM Patient P JOIN Admission A ON P.healthNum = A.pID ORDER BY A.date DESC;"
  );
  const [result, setResult] = useState([]);
  // const [tasksCompleted, setTasksCompleted] = useState(1);
  const [correctAnswerResult, setCorrectAnswerResult] = useState(null);
  const [imageState, setImageState] = useState("thinking");
  const [message, setMessage] = useState("");
  const [buttonsDisabled, setButtonsDisabled] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    answer: "",
  });
  const [hintsUsedForQuestion, setHintsUsedForQuestion] = useState(0);

  const [startTime, setStartTime] = useState(null);
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState(["Query Novice", "JOIN Master"]);
  // const [accuracy, setAccuracy] = useState(100);
  // const [responseTimes, setResponseTimes] = useState([]);
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

  const loadQuestion = useCallback(async () => {
    setHintsUsedForQuestion(0);

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
      setCurrentQuestion(selectedQuestion); // Keep the entire question object in the state
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

      const questionDifficulty = currentQuestion.difficulty; // Get current question difficulty
      let earnedPoints = correct ? currentQuestion.points : 0;
      earnedPoints = Math.max(earnedPoints - hintsUsedForQuestion, 0); // Deduct hints used

      // Update playerPoints for the chart
      setPlayerPoints((prevPoints) => {
        const updatedPoints = { ...prevPoints };
        updatedPoints[questionDifficulty] = [
          ...updatedPoints[questionDifficulty],
          earnedPoints,
        ];
        return updatedPoints;
      });

      const questionData = {
        userId: "user123",
        question: currentQuestion.question,
        difficulty: questionDifficulty,
        correctAnswer: currentQuestion.answer,
        userAnswerResult: userResult,
        isCorrect: correct,
        timeTaken: (Date.now() - startTime) / 1000, // Calculate time taken
        pointsEarned: earnedPoints,
        timestamp: new Date(),
      };

      saveUserData(questionData);

      if (correct) {
        setPoints((prevPoints) => {
          const newPoints = prevPoints + earnedPoints;

          if (newPoints >= 100) {
            // Promote to the next difficulty and reset points
            if (questionDifficulty === "easy") {
              setCurrentDifficulty("medium");
              setMessage("Congratulations! You've advanced to Medium Level.");
            } else if (questionDifficulty === "medium") {
              setCurrentDifficulty("hard");
              setMessage("Amazing! You've advanced to Hard Level.");
            }

            // Reset points to 0 after progressing
            setTimeout(() => {
              setPoints(0);
              loadQuestion(); // Load a question for the new difficulty
            }, 2000);

            return 0; // Reset points to 0 in state
          }

          return newPoints;
        });

        setMessage("Good job!");
        triggerConfetti();

        // Load the next question if points are below the threshold
        if (points + earnedPoints < 100) {
          setTimeout(() => {
            setMessage("");
            loadQuestion();
          }, 2000);
        }
      } else {
        setRetryCount((prev) => prev + 1);
        setMessage("Try again");
        setTimeout(() => {
          setImageState("thinking");
          setMessage(`Current Task: ${currentQuestion.question}`);
        }, 3000);
      }
    },
    [
      correctAnswerResult,
      currentQuestion,
      currentDifficulty,
      playerPoints,
      startTime,
      loadQuestion, // Ensure this dependency is included
      points,
      hintsUsedForQuestion, // Ensure hint usage affects the points calculation
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

  // -> display badge with color
  // dumping some ideas i have in mind so that I don't forget
  // the logic for this is not very good, make it work first for now, but then improve how it is working.
  // load the badges the users have in the SQLEditor, and then from the manipulate the badges individually
  // make a post request to the api, update it in the database, in case the user reloads, it loads the page with the most recent badges
  // think about this for the point system as well.
  // the user from AuthContext should be used only to manipulate the user data, not individual parts of the user data
  useEffect(() => {
    if (user.badges) {
      setBadges(user.badges);
    }
  }, []);

  // when user clicks in the badge, open a modal with the image, the name, and how to get it.
  const [badgeState, setBadgeState] = useState({ open: false, name: "" });

  const openBadgeModal = (badge) => {
    console.log(badge);
    setBadgeState({ open: true, badgeData: badge });
  };

  const closeBadgeModal = () => {
    setBadgeState({ open: false, badgeData: null });
  };
  console.log(currentQuestion.points);
  return (
    <div className="sql-editor-container">
      {/* open this div as the modal for the badge */}
      {badgeState.open && (
        <BadgeModal
          closeBadgeModal={closeBadgeModal}
          badgeData={badgeState.badgeData}
        />
      )}
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
        currentQuestionPoints={currentQuestion.points}
        retries={retryCount}
        badges={badges}
        badgesData={badgesData}
        openBadgeModal={openBadgeModal}
        pointsData={playerPoints}
        idealPoints={dynamicIdealPoints}
        errorHint={errorHint}
        hintsUsedForQuestion={hintsUsedForQuestion}
        setHintsUsedForQuestion={setHintsUsedForQuestion}
      />
    </div>
  );
}

export default SQLEditor;
