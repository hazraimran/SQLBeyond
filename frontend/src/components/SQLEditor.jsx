import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import confetti from "canvas-confetti";
import LeftSidebar from "./Sidebar/LeftSidebar";
import RightSidebar from "./Sidebar/RightSidebar";
import Editor from "./SQLEditorComponents/Editor";
import questions from "../data/questions";
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
  const [query, setQuery] = useState("SELECT * FROM Patient");
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
  }); // Points for each question per difficulty level
  const [dynamicIdealPoints, setDynamicIdealPoints] = useState([10, 50, 100]); // Default points

  const [hasExecuted, setHasExecuted] = useState(false);

  // Helper to fetch the correct result for a question
  const fetchCorrectAnswerResult = useCallback(async (correctQuery) => {
    try {
      const response = await fetch(`${apiUrl}/execute-query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: correctQuery }),
      });
      const data = await response.json();
      return response.ok ? data.results : null;
    } catch (error) {
      console.error("Error fetching correct answer:", error);
      return null;
    }
  }, []);

  // Function to calculate points based on queryExecutionTime and totalTimeToSolve
  const calculatePoints = (responseTime) => {
    const { queryExecutionTime, totalTimeToSolve } = currentQuestion.metrics;

    let executionTimePoints = 0;
    let totalSolveTimePoints = 0;

    // Calculate points for queryExecutionTime
    if (responseTime <= queryExecutionTime.excellent.threshold) {
      executionTimePoints = queryExecutionTime.excellent.points;
    } else if (responseTime <= queryExecutionTime.mediocre.threshold) {
      executionTimePoints = queryExecutionTime.mediocre.points;
    } else {
      executionTimePoints = queryExecutionTime.poor.points;
    }

    // Calculate points for totalTimeToSolve
    if (responseTime <= totalTimeToSolve.excellent.threshold) {
      totalSolveTimePoints = totalTimeToSolve.excellent.points;
    } else if (responseTime <= totalTimeToSolve.mediocre.threshold) {
      totalSolveTimePoints = totalTimeToSolve.mediocre.points;
    } else {
      totalSolveTimePoints = totalTimeToSolve.poor.points;
    }

    // Combine the points from both metrics
    return executionTimePoints + totalSolveTimePoints;
  };

  // Function to dynamically load a question
  const loadQuestion = useCallback(async () => {
    setImageState("thinking");
    setButtonsDisabled(true);

    const questionList = questions[currentDifficulty];
    const remainingQuestions = questionList.filter(
      (q) => !usedQuestions[currentDifficulty].includes(q.question)
    );

    let selectedQuestion;

    if (remainingQuestions.length > 0) {
      // Select a random question from the remaining pool
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
      // Reset the used questions for the current difficulty if all are shown
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

  // const checkAnswer = useCallback(
  //   (userResult) => {
  //     const correct =
  //       JSON.stringify(userResult) === JSON.stringify(correctAnswerResult);
  //     const responseTime = (Date.now() - startTime) / 1000;
  //     setResponseTimes((prev) => [...prev, responseTime]);

  //     if (correct) {
  //       const earnedPoints = calculatePoints(responseTime);

  //       // Ensure the current question's difficulty is used for point assignment
  //       const questionDifficulty = currentQuestion.difficulty;

  //       // Update total points and playerPoints
  //       setPoints((prevPoints) => prevPoints + earnedPoints);
  //       setPlayerPoints((prev) => {
  //         const updatedPoints = { ...prev };
  //         updatedPoints[questionDifficulty] = [
  //           ...updatedPoints[questionDifficulty],
  //           earnedPoints, // Add the new earned points
  //         ];
  //         return updatedPoints;
  //       });

  //       // Update badges
  //       if (points + earnedPoints >= 100 && !badges.includes("SQL Expert")) {
  //         setBadges((prevBadges) => [...prevBadges, "SQL Expert"]);
  //       }

  //       // Progression based on points
  //       setTimeout(() => {
  //         const totalPointsInDifficulty = playerPoints[
  //           questionDifficulty
  //         ].reduce((a, b) => a + b, 0);
  //         const requiredPoints =
  //           questionDifficulty === "easy"
  //             ? 30
  //             : questionDifficulty === "medium"
  //             ? 150
  //             : Infinity;

  //         if (totalPointsInDifficulty >= requiredPoints) {
  //           if (questionDifficulty === "easy") setCurrentDifficulty("medium");
  //           else if (questionDifficulty === "medium")
  //             setCurrentDifficulty("hard");
  //         }
  //       }, 0); // Ensure points update before progression

  //       setTasksCompleted((prev) => prev + 1);
  //       setMessage("Good job!");
  //       triggerConfetti();
  //       setTimeout(loadQuestion, 3000);
  //     } else {
  //       setRetryCount((prev) => prev + 1);
  //       setImageState("sad"); // Show the "Try Again" image
  //       setMessage("Try again");
  //       setTimeout(() => {
  //         setImageState("thinking"); // Reset to a neutral image
  //         setMessage(`Current Task: ${currentQuestion.question}`);
  //       }, 3000); // Show the message and image for 3 seconds

  //       if (retryCount >= 3) {
  //         setAccuracy((prevAccuracy) => Math.max(0, prevAccuracy - 10));
  //       }
  //     }
  //   },
  //   [
  //     correctAnswerResult,
  //     startTime,
  //     responseTimes,
  //     accuracy,
  //     retryCount,
  //     badges,
  //     currentDifficulty,
  //     loadQuestion,
  //     tasksCompleted,
  //     currentQuestion,
  //     calculatePoints,
  //     playerPoints,
  //     points,
  //   ]
  // );

  const checkAnswer = useCallback(
    (userResult) => {
      const correct =
        JSON.stringify(userResult) === JSON.stringify(correctAnswerResult);
      const responseTime = (Date.now() - startTime) / 1000;
      setResponseTimes((prev) => [...prev, responseTime]);

      const earnedPoints = correct ? calculatePoints(responseTime) : 0;

      console.log(currentQuestion);

      // Prepare user data to send to the backend
      const questionData = {
        userId: "user123", // Replace with a dynamic user ID if available
        question: currentQuestion.question,
        difficulty: currentDifficulty,
        correctAnswer: currentQuestion.answer,
        userAnswerResult: userResult,
        isCorrect: correct,
        timeTaken: responseTime,
        pointsEarned: earnedPoints,
        timestamp: new Date(),
      };

      saveUserData(questionData); // Save performance data to the backend

      if (correct) {
        // Ensure the current question's difficulty is used for point assignment
        const questionDifficulty = currentQuestion.difficulty;

        // Update total points and playerPoints
        setPoints((prevPoints) => prevPoints + earnedPoints);
        setPlayerPoints((prev) => {
          const updatedPoints = { ...prev };
          updatedPoints[questionDifficulty] = [
            ...updatedPoints[questionDifficulty],
            earnedPoints, // Add the new earned points
          ];
          return updatedPoints;
        });

        // Update badges
        if (points + earnedPoints >= 100 && !badges.includes("SQL Expert")) {
          setBadges((prevBadges) => [...prevBadges, "SQL Expert"]);
        }

        // Progression based on points
        setTimeout(() => {
          const totalPointsInDifficulty = playerPoints[
            questionDifficulty
          ].reduce((a, b) => a + b, 0);
          const requiredPoints =
            questionDifficulty === "easy"
              ? 30
              : questionDifficulty === "medium"
              ? 150
              : Infinity;

          if (totalPointsInDifficulty >= requiredPoints) {
            if (questionDifficulty === "easy") setCurrentDifficulty("medium");
            else if (questionDifficulty === "medium")
              setCurrentDifficulty("hard");
          }
        }, 0); // Ensure points update before progression

        setTasksCompleted((prev) => prev + 1);
        setMessage("Good job!");
        triggerConfetti();
        setTimeout(loadQuestion, 3000);
      } else {
        setRetryCount((prev) => prev + 1);
        setImageState("sad"); // Show the "Try Again" image
        setMessage("Try again");
        setTimeout(() => {
          setImageState("thinking"); // Reset to a neutral image
          setMessage(`Current Task: ${currentQuestion.question}`);
        }, 3000); // Show the message and image for 3 seconds

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

  // // Function to execute user's query
  // const executeQuery = async (userQuery) => {
  //   try {
  //     const response = await fetch(`${apiUrl}/execute-query`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ query: userQuery }),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       setResult(data.results);
  //       checkAnswer(data.results);
  //     } else {
  //       setResult([{ error: "Syntax error or invalid query." }]);
  //       setImageState("sad");
  //       setMessage("Try again");
  //       setTimeout(() => {
  //         setMessage(`Current Task: ${currentQuestion.question}`);
  //       }, 2000);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //     setResult([{ error: "Error connecting to server." }]);
  //     setImageState("sad");
  //     setMessage("Try again");
  //     setTimeout(() => {
  //       setMessage(`Current Task: ${currentQuestion.question}`);
  //     }, 2000);
  //   }
  // };

  const executeQuery = async (userQuery, limitRows = false) => {
    try {
      const response = await fetch(`${apiUrl}/execute-query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery, limitRows }),
      });

      const data = await response.json();

      if (response.ok) {
        // If limitRows is true, show only the first 10 rows
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
    try {
      const response = await fetch(`${apiUrl}/execute-query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.results);
        checkAnswer(data.results); // Compare full result with expected output
      } else {
        setResult([{ error: "Syntax error or invalid query." }]);
        setMessage("Submit failed. Check your query.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResult([{ error: "Error connecting to server." }]);
      setMessage("Submit failed.");
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
          setQuery={setQuery}
          query={query}
          executeQuery={(content) => executeQuery(content, true)} // Limit rows to 10 for Run
          submitQuery={submitQuery} // Pass submitQuery to handle full comparison
          buttonsDisabled={buttonsDisabled}
        />
        {/* <DifficultyChart pointsData={playerPoints} /> */}
        <div className="result">
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
        setProgress={setPoints} // Allow progress updates
        query={query} // Pass the current query
        taskDescription={currentQuestion} // Pass the task description
        retries={retryCount} // Pass the current retry count
        badges={badges}
        pointsData={playerPoints}
        idealPoints={dynamicIdealPoints}
      />
    </div>
  );
}

export default SQLEditor;
