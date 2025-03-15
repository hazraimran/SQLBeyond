import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import confetti from "canvas-confetti";
import PropTypes from "prop-types";

import LeftSidebar from "./Sidebar/LeftSidebar/LeftSidebar";
import RightSidebar from "./Sidebar/RightSidebar/RightSidebar";
import Editor from "./SQLEditorComponents/Editor";
import DisplayTables from "./SQLEditorComponents/DisplayTables";
import BadgeModal from "./Modal/BadgeModal";
import LogoutModal from "./Modal/LogoutModal";

import { useAuth } from "./Login/AuthContext";
import { useGame } from "./Context/GameContext";

import badgesData from "../data/badges";
// For test only:
// import questions from "../data/oldQuestions-backup";
import questions from "../data/questions";

import logToCSV from "../utils/logger";
import evaluateBadges from "../utils/badgeEvaluator"; // <-- import the badge evaluator

import "../styles/SQLEditor.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

/**
 * Helper function to compare two result sets ignoring row order.
 * Sorts both arrays by their JSON string so row order doesn't matter.
 */
function compareResultSets(userRows, correctRows) {
  if (!Array.isArray(userRows) || !Array.isArray(correctRows)) return false;
  if (userRows.length !== correctRows.length) return false;

  const sortedUser = [...userRows].sort((a, b) =>
    JSON.stringify(a).localeCompare(JSON.stringify(b))
  );
  const sortedCorrect = [...correctRows].sort((a, b) =>
    JSON.stringify(a).localeCompare(JSON.stringify(b))
  );

  return JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
}

function SQLEditor() {
  const location = useLocation();
  const user = useAuth().user;
  const gameMethods = useGame();
  const gameData = useGame().gameData;

  // Default name from user data
  const { name = `${user.firstName} ${user.lastName}` } = location.state || {};

  // ---------------------- Local States ----------------------
  const [query, setQuery] = useState(
    `example:
SELECT fields
FROM table_name;`
  );
  const [result, setResult] = useState([]);
  const [correctAnswerResult, setCorrectAnswerResult] = useState(null);
  const [message, setMessage] = useState("");
  const [buttonsDisabled, setButtonsDisabled] = useState(true);

  const [hintsUsedForQuestion, setHintsUsedForQuestion] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const [startTime, setStartTime] = useState(null);

  const [badges, setBadges] = useState([]);
  const [badgeState, setBadgeState] = useState({
    open: false,
    badgeData: null,
  });

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

  // For the AI Assistant error guidance
  const [errorHint, setErrorHint] = useState("");

  // ✅ Store expected output (top 5 rows) for the user to see
  const [expectedOutput, setExpectedOutput] = useState([]);

  // ---------------------- Player Stats for Badges ----------------------
  const [playerStats, setPlayerStats] = useState({
    successfulJoins: 0,
    successfulLogicTasks: 0,
    consecutiveTasksWithoutHints: 0,
    lastTaskUsedHints: false,
  });

  // ---------------------- Table Pinning States ----------------------
  const [isTableOn, setIsTableOn] = useState(false);
  const [tableContent, setTableContent] = useState([]);
  const checkTable = useRef(new Set());

  // ---------------------- Logout Modal State ----------------------
  const [logoutModal, setLogoutModal] = useState(false);

  // ---------------------- Helper Functions ----------------------
  const detectJoinUsage = (queryText) => /\bJOIN\b/i.test(queryText);
  const detectLogicUsage = (queryText) => /\b(AND|OR|NOT)\b/i.test(queryText);

  const calculateCompletionTime = () => {
    if (!startTime) return 999999; // fallback if not set
    return Math.floor((Date.now() - startTime) / 1000); // in seconds
  };

  // Update local playerStats after a correct answer
  const updatePlayerStats = (userQuery, usedHints) => {
    setPlayerStats((prev) => {
      const usedHintThisTask = usedHints > 0;
      return {
        successfulJoins: detectJoinUsage(userQuery)
          ? prev.successfulJoins + 1
          : prev.successfulJoins,
        successfulLogicTasks: detectLogicUsage(userQuery)
          ? prev.successfulLogicTasks + 1
          : prev.successfulLogicTasks,
        consecutiveTasksWithoutHints: usedHintThisTask
          ? 0
          : prev.consecutiveTasksWithoutHints + 1,
        lastTaskUsedHints: usedHintThisTask,
      };
    });
  };

  // Evaluate which badges should unlock, then open modals for new ones
  const evaluateAndUnlockBadges = () => {
    const completedTasks = [
      ...usedQuestions.easy,
      ...usedQuestions.medium,
      ...usedQuestions.hard,
    ];

    const unlockedBadges = evaluateBadges({
      playerPoints,
      retries: retryCount,
      hintsUsedForQuestion,
      completedTasks,
      currentLevel: gameData.currentDifficulty,
      currentTask: gameData.currentQuestion,
      successfulJoins: playerStats.successfulJoins,
      successfulLogicTasks: playerStats.successfulLogicTasks,
      consecutiveTasksWithoutHints: playerStats.consecutiveTasksWithoutHints,
      completionTime: calculateCompletionTime(),
      reflectiveQuestionsCorrect:
        gameData.currentQuestion.reflectiveQuestionsCorrect || false,
    });

    // Filter out badges the user already has
    const newBadges = unlockedBadges.filter((b) => !badges.includes(b));

    if (newBadges.length > 0) {
      // Add to local state
      setBadges((prev) => [...prev, ...newBadges]);

      // Optionally save to user in DB
      // saveUserData({ ...user, badges: [...badges, ...newBadges] });

      // Trigger confetti or show modal for each new badge
      newBadges.forEach((badgeName) => {
        const foundBadge = badgesData.find((bd) => bd.name === badgeName);
        if (foundBadge) {
          openBadgeModal(foundBadge);
        }
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

  // ---------------------- DB Query Functions ----------------------
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
        setMessage("❌ Try again");
      }
    } catch (error) {
      console.error("Error:", error);
      setResult([{ error: "Error connecting to server." }]);
      setMessage("❌ Try again");
      setTimeout(() => {
        setMessage(`Current Task: ${gameData.currentQuestion.question}`);
      }, 3000);
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
        setErrorHint(""); // Clear error if query is correct
        checkAnswer(data.results, userQuery);

        // Logging
        logToCSV({
          timestamp,
          action: "Query Submitted",
          query: userQuery,
          result: JSON.stringify(data.results),
          status: "Success",
        });
      } else {
        setErrorHint("Your query has a syntax error or is invalid.");
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
      setErrorHint("An error occurred while connecting to the server.");
      logToCSV({
        timestamp,
        action: "Query Submitted",
        query: userQuery,
        result: "Server Error",
        status: "Error",
      });
    }
  };

  // ---------------------- Answer Checking ----------------------
  //
  //  MODIFIED to ignore row order by sorting both arrays before compare
  //
  const checkAnswer = useCallback(
    (userResult, userQuery) => {
      // Sort and compare ignoring row order
      const correct = compareResultSets(userResult, correctAnswerResult);

      const questionDifficulty = gameData.currentQuestion.difficulty;
      let earnedPoints = correct ? gameData.currentQuestion.points : 0;
      earnedPoints = Math.max(earnedPoints - hintsUsedForQuestion, 0);

      if (correct) {
        // Update local points
        setPlayerPoints((prevPoints) => {
          const updatedPoints = { ...prevPoints };
          updatedPoints[questionDifficulty] = [
            ...updatedPoints[questionDifficulty],
            earnedPoints,
          ];
          return updatedPoints;
        });

        // Update global game points (if needed)
        gameMethods.updatePoints(gameData.points, earnedPoints, playerPoints);

        // Track stats for badges
        updatePlayerStats(userQuery, hintsUsedForQuestion);

        // Congratulate user
        setMessage("✅ Good job!");
        triggerConfetti();

        // Evaluate & unlock badges
        evaluateAndUnlockBadges();

        // Move to next question after 3 seconds
        setTimeout(() => {
          setMessage("");
          loadQuestion();
        }, 3000);
      } else {
        // If incorrect
        setRetryCount((prev) => prev + 1);
        setMessage("❌ Try again");
        setTimeout(() => {
          setMessage(`Current Task: ${gameData.currentQuestion.question}`);
        }, 3000);
      }
    },
    [
      correctAnswerResult,
      gameData.currentQuestion,
      gameData.currentDifficulty,
      hintsUsedForQuestion,
      gameData.points,
      playerPoints,
    ]
  );

  // ---------------------- Loading Questions ----------------------
  const loadQuestion = useCallback(async () => {
    setHintsUsedForQuestion(0);
    setButtonsDisabled(true);

    const questionList = questions[gameData.currentDifficulty];
    const remainingQuestions = questionList.filter(
      (q) => !usedQuestions[gameData.currentDifficulty].includes(q.question)
    );

    let selectedQuestion;
    if (remainingQuestions.length > 0) {
      selectedQuestion =
        remainingQuestions[
          Math.floor(Math.random() * remainingQuestions.length)
        ];
      setUsedQuestions((prev) => ({
        ...prev,
        [gameData.currentDifficulty]: [
          ...prev[gameData.currentDifficulty],
          selectedQuestion.question,
        ],
      }));
    } else {
      // Reset usedQuestions if all are used
      setUsedQuestions((prev) => ({
        ...prev,
        [gameData.currentDifficulty]: [],
      }));
      selectedQuestion =
        questionList[Math.floor(Math.random() * questionList.length)];
    }

    if (selectedQuestion) {
      // Update context
      gameMethods.updateGameData("currentQuestion", selectedQuestion);
      setStartTime(Date.now());

      // Get the correct result for comparison
      const correctResult = await fetchCorrectAnswerResult(
        selectedQuestion.answer
      );
      setExpectedOutput(correctResult ? correctResult.slice(0, 5) : []);
      setCorrectAnswerResult(correctResult);

      setMessage(`${selectedQuestion.question}`);
      setTimeout(() => setButtonsDisabled(false), 2000);
    }
  }, [gameData.currentDifficulty, fetchCorrectAnswerResult, usedQuestions]);

  // ---------------------- Effects ----------------------
  useEffect(() => {
    if (gameData.currentDifficulty !== "easy") {
      setMessage(
        `Congratulations! You've advanced to ${gameData.currentDifficulty} Level.`
      );
      setTimeout(() => {
        setMessage("");
        loadQuestion();
      }, 3000);
      return;
    }
    loadQuestion();
  }, [gameData.currentDifficulty]);

  useEffect(() => {
    if (!hasExecuted) {
      setHasExecuted(true);
      const userData = JSON.parse(localStorage.getItem("userData")) || {};
      console.log("idealSlope", userData.idealSlope);
      if (userData.idealSlope) {
        setDynamicIdealPoints([
          userData.idealSlope.easy,
          userData.idealSlope.medium,
          userData.idealSlope.hard,
        ]);
      }
    }
  }, [hasExecuted, loadQuestion, name]);

  useEffect(() => {
    if (user.badges) setBadges(user.badges);
  }, []);

  // ---------------------- Badge Modal ----------------------
  const openBadgeModal = (badge) => {
    setBadgeState({ open: true, badgeData: badge });
  };

  const closeBadgeModal = () => {
    setBadgeState({ open: false, badgeData: null });
  };

  // ---------------------- Table Toggling ----------------------
  const handleTableActions = () => {
    setIsTableOn((prev) => !prev);
  };

  const addTableContent = (table) => {
    if (checkTable.current.has(table.name)) return;
    checkTable.current.add(table.name);
    setTableContent((prev) => [...prev, table]);
  };

  const removeTableContent = (table) => {
    if (!checkTable.current.has(table.name)) return;
    checkTable.current.delete(table.name);
    setTableContent((prev) => prev.filter((t) => t.name !== table.name));
  };

  // ---------------------- Logout Modal ----------------------
  const openLogoutModal = () => {
    setLogoutModal(true);
  };
  const closeLogoutModal = () => {
    setLogoutModal(false);
  };

  // ---------------------- Pinned Table Animation ----------------------
  const [animationClass, setAnimationClass] = useState("");
  const handleAnimationClick = () => {
    setAnimationClass("jump-animation");
    setTimeout(() => {
      setAnimationClass("");
    }, 1000);
  };

  // ---------------------- Render ----------------------
  return (
    <div className="sql-editor-container">
      {/* Badge modal */}
      {badgeState.open && (
        <BadgeModal
          closeBadgeModal={closeBadgeModal}
          badgeData={badgeState.badgeData}
        />
      )}

      {/* Logout modal */}
      {logoutModal && <LogoutModal closeLogoutModal={closeLogoutModal} />}

      {/* Left Sidebar */}
      <LeftSidebar
        message={message}
        handleTableContent={addTableContent}
        expectedOutput={expectedOutput}
        handleAnimationClick={handleAnimationClick}
      />

      {/* Main Editor */}
      <div className="main-editor">
        <Editor
          setQuery={setQuery}
          query={query}
          executeQuery={(content) => executeQuery(content, true)}
          submitQuery={submitQuery}
          buttonsDisabled={buttonsDisabled}
        />

        {/* Result Section */}
        <div className="result">
          <div className="result-btns">
            <button onClick={() => setIsTableOn(false)}>Query Results</button>
            <button onClick={handleTableActions} className={animationClass}>
              Pinned Tables
            </button>
          </div>

          {isTableOn ? (
            <DisplayTables
              tableContent={tableContent}
              removeTable={removeTableContent}
            />
          ) : (
            <QueryResult result={result} />
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <RightSidebar
        progress={gameData.points}
        query={query}
        taskDescription={gameData.currentQuestion}
        currentQuestionPoints={gameData.currentQuestion.points}
        retries={retryCount}
        badges={badges}
        badgesData={badgesData}
        openBadgeModal={openBadgeModal}
        pointsData={playerPoints}
        idealPoints={dynamicIdealPoints}
        errorHint={errorHint}
        hintsUsedForQuestion={hintsUsedForQuestion}
        setHintsUsedForQuestion={setHintsUsedForQuestion}
        user={user}
        openLogoutModal={openLogoutModal}
      />
    </div>
  );
}

// ---------------------- Sub-Components ----------------------
function QueryResult({ result }) {
  return (
    <>
      <h3>Query Result:</h3>
      <div className="table-container">
        {Array.isArray(result) ? (
          <table>
            <thead>
              <tr>
                {result.length > 0 &&
                  Object.keys(result[0]).map((key) => <th key={key}>{key}</th>)}
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
    </>
  );
}

// Add prop types for QueryResult
QueryResult.propTypes = {
  result: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.string,
  ]).isRequired,
};

QueryResult.defaultProps = {
  result: [],
};

export default SQLEditor;
