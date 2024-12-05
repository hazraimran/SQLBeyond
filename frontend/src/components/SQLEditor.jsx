// import { useState, useEffect, useCallback } from "react";
// import { useLocation } from "react-router-dom";
// import confetti from "canvas-confetti";
// import LeftSidebar from "./Sidebar/LeftSidebar";
// import RightSidebar from "./Sidebar/RightSidebar";
// import Editor from "./SQLEditorComponents/Editor";
// import questions from "../data/questions";
// import "../styles/SQLEditor.css";

// const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

// function generateLearningCurve(tasksCompleted, initialPerformance) {
//   const m = 0.02;
//   const b = initialPerformance;
//   return m * tasksCompleted + b;
// }

// function getQuestionBasedOnPerformance(tasksCompleted, initialPerformance) {
//   const performance = generateLearningCurve(tasksCompleted, initialPerformance);
//   let difficulty;

//   if (performance < 0.4) difficulty = "easy";
//   else if (performance < 0.7) difficulty = "medium";
//   else difficulty = "hard";

//   const questionList = questions["Select"][difficulty];
//   return questionList[Math.floor(Math.random() * questionList.length)];
// }

// const SQLEditor = () => {
//   const location = useLocation();
//   const savedUserData = JSON.parse(localStorage.getItem("userData")) || {};
//   const savedState = JSON.parse(localStorage.getItem("sqlEditorState")) || {}; // Retrieve saved state

//   const {
//     name = savedUserData.name,
//     company = savedUserData.company,
//     position = savedUserData.position,
//     initialPerformance = savedUserData.initialPerformance || 0,
//   } = location.state || {};

//   const [query, setQuery] = useState("SELECT * FROM Patient");
//   const [result, setResult] = useState([]);
//   const [tasksCompleted, setTasksCompleted] = useState(
//     savedState.tasksCompleted || 1
//   );
//   const [correctAnswerResult, setCorrectAnswerResult] = useState(null);
//   const [imageState, setImageState] = useState("thinking");
//   const [message, setMessage] = useState("");
//   const [buttonsDisabled, setButtonsDisabled] = useState(true);
//   const [currentQuestion, setCurrentQuestion] = useState(
//     savedState.currentQuestion || { question: "", answer: "" }
//   );
//   const [startTime, setStartTime] = useState(null);
//   const [points, setPoints] = useState(savedState.points || 0);
//   const [badges, setBadges] = useState(
//     savedState.badges || ["Query Novice", "JOIN Master"]
//   );
//   const [hasExecuted, setHasExecuted] = useState(
//     Boolean(Object.keys(savedState).length) // If `savedState` exists, skip intro
//   );

//   const loadQuestion = useCallback(async () => {
//     setImageState("thinking");
//     setButtonsDisabled(true);

//     const question = getQuestionBasedOnPerformance(
//       tasksCompleted,
//       initialPerformance
//     );

//     if (question) {
//       setCurrentQuestion(question);
//       setStartTime(Date.now());
//       const correctAnswerQuery = question.answer;
//       const correctResult = await fetchCorrectAnswerResult(correctAnswerQuery);
//       setCorrectAnswerResult(correctResult);
//       setMessage(`Current Task: ${question.question}`);
//       setTimeout(() => setButtonsDisabled(false), 2000);
//     }
//   }, [tasksCompleted, initialPerformance]);

//   useEffect(() => {
//     if (!hasExecuted) {
//       setHasExecuted(true);
//       if (!Object.keys(savedState).length) {
//         // Show intro message only if there's no saved state
//         setMessage(
//           `Hi ${name || "User"}, I'm Joe from ${
//             company || "your company"
//           }, manager for ${
//             position || "your position"
//           }. Let's start your assessment.`
//         );
//         setImageState("happy");
//         setButtonsDisabled(true);
//         setTimeout(() => {
//           loadQuestion();
//         }, 5000);
//       } else {
//         // If state exists, load the current question directly
//         loadQuestion();
//       }
//     }
//   }, [hasExecuted, loadQuestion, savedState, name, company, position]);

//   const fetchCorrectAnswerResult = useCallback(async (correctQuery) => {
//     try {
//       const response = await fetch(`${apiUrl}/execute-query`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ query: correctQuery }),
//       });
//       const data = await response.json();
//       return response.ok ? data.results : null;
//     } catch (error) {
//       console.error("Error fetching correct answer:", error);
//       return null;
//     }
//   }, []);

//   const executeQuery = async (userQuery) => {
//     try {
//       const response = await fetch(`${apiUrl}/execute-query`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ query: userQuery }),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setResult(data.results);
//         checkAnswer(data.results);
//       } else {
//         setResult([{ error: "Error executing query" }]);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setResult([{ error: "Error connecting to server" }]);
//     }
//   };

//   const checkAnswer = useCallback(
//     (userResult) => {
//       if (JSON.stringify(userResult) === JSON.stringify(correctAnswerResult)) {
//         const timeTaken = (Date.now() - startTime) / 1000;
//         console.log(`Time taken to complete question: ${timeTaken} seconds`);

//         setImageState("helpful");
//         setMessage("Good job!");

//         setPoints((prevPoints) => {
//           const newPoints = prevPoints + 50;
//           if (newPoints >= 100) {
//             const badgeNumber = badges.length + 1; // Use length of badges for uniqueness
//             const newBadge = `Achievement ${badgeNumber}`;
//             setBadges((prevBadges) =>
//               prevBadges.includes(newBadge)
//                 ? prevBadges
//                 : [...prevBadges, newBadge]
//             );
//             return 0; // Reset points
//           }
//           return newPoints;
//         });

//         triggerConfetti();
//         setTimeout(() => {
//           setTasksCompleted((prev) => prev + 1);
//           loadQuestion();
//         }, 3000);
//       } else {
//         setImageState("happy");
//         setMessage("Try again");
//         setTimeout(() => {
//           setMessage(`Current Task: ${currentQuestion.question}`);
//         }, 2000);
//       }
//     },
//     [correctAnswerResult, startTime, loadQuestion, badges, currentQuestion]
//   );

//   const triggerConfetti = () => {
//     confetti({
//       particleCount: 100,
//       spread: 70,
//       origin: { y: 0.6 },
//     });
//   };

//   return (
//     <div className="sql-editor-container">
//       <LeftSidebar imageState={imageState} message={message} />
//       <div className="main-editor">
//         <Editor
//           setQuery={setQuery}
//           query={query}
//           executeQuery={executeQuery}
//           buttonsDisabled={buttonsDisabled}
//         />
//         <div className="result">
//           <h3>Query Result:</h3>
//           <div className="table-container">
//             {Array.isArray(result) ? (
//               <table>
//                 <thead>
//                   <tr>
//                     {result.length > 0 &&
//                       Object.keys(result[0]).map((key) => (
//                         <th key={key}>{key}</th>
//                       ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {result.map((row, index) => (
//                     <tr key={index}>
//                       {Object.values(row).map((value, i) => (
//                         <td key={i}>{value}</td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <pre>{result}</pre>
//             )}
//           </div>
//         </div>
//       </div>
//       <RightSidebar
//         progress={points}
//         badges={badges}
//         question={currentQuestion.question} // Pass currentQuestion object
//       />
//     </div>
//   );
// };

// export default SQLEditor;

import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import confetti from "canvas-confetti";
import LeftSidebar from "./Sidebar/LeftSidebar";
import RightSidebar from "./Sidebar/RightSidebar";
import Editor from "./SQLEditorComponents/Editor";
import questions from "../data/questions";
import "../styles/SQLEditor.css";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

function generateLearningCurve(tasksCompleted, initialPerformance) {
  const m = 0.02;
  const b = initialPerformance;
  return m * tasksCompleted + b;
}

function getQuestionBasedOnPerformance(tasksCompleted, initialPerformance) {
  const performance = generateLearningCurve(tasksCompleted, initialPerformance);
  let difficulty;

  if (performance < 0.4) difficulty = "easy";
  else if (performance < 0.7) difficulty = "medium";
  else difficulty = "hard";

  const questionList = questions["Select"][difficulty];
  return questionList[Math.floor(Math.random() * questionList.length)];
}

const SQLEditor = () => {
  const location = useLocation();
  const savedUserData = JSON.parse(sessionStorage.getItem("userData")) || {};
  const savedState = JSON.parse(sessionStorage.getItem("sqlEditorState")) || {};

  const {
    name = savedUserData.name,
    company = savedUserData.company,
    position = savedUserData.position,
    initialPerformance = savedUserData.initialPerformance || 0,
  } = location.state || {};

  const [query, setQuery] = useState("SELECT * FROM Patient");
  const [result, setResult] = useState([]);
  const [tasksCompleted, setTasksCompleted] = useState(
    savedState.tasksCompleted || 1
  );
  const [correctAnswerResult, setCorrectAnswerResult] = useState(null);
  const [imageState, setImageState] = useState("thinking");
  const [message, setMessage] = useState("");
  const [buttonsDisabled, setButtonsDisabled] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(
    savedState.currentQuestion || { question: "", answer: "" }
  );
  const [startTime, setStartTime] = useState(null);
  const [points, setPoints] = useState(savedState.points || 0);
  const [badges, setBadges] = useState(
    savedState.badges || ["Query Novice", "JOIN Master"]
  );
  const [hasExecuted, setHasExecuted] = useState(false);

  const loadQuestion = useCallback(async () => {
    setImageState("thinking");
    setButtonsDisabled(true);

    const question = getQuestionBasedOnPerformance(
      tasksCompleted,
      initialPerformance
    );

    if (question) {
      setCurrentQuestion(question);
      setStartTime(Date.now());
      const correctAnswerQuery = question.answer;
      const correctResult = await fetchCorrectAnswerResult(correctAnswerQuery);
      setCorrectAnswerResult(correctResult);
      setMessage(`Current Task: ${question.question}`);
      setTimeout(() => setButtonsDisabled(false), 2000);
    }
  }, [tasksCompleted, initialPerformance]);

  useEffect(() => {
    if (!hasExecuted) {
      setHasExecuted(true);

      if (!savedState.currentQuestion) {
        setMessage(
          `Hi ${name || "User"}, I'm Joe from ${
            company || "your company"
          }, manager for ${
            position || "your position"
          }. Let's start your assessment.`
        );
        setImageState("happy");
        setButtonsDisabled(true);
        setTimeout(() => {
          loadQuestion();
        }, 5000);
      } else {
        setMessage(`Current Task: ${savedState.currentQuestion.question}`);
      }
    }
  }, [
    hasExecuted,
    loadQuestion,
    name,
    company,
    position,
    savedState.currentQuestion,
  ]);

  useEffect(() => {
    sessionStorage.setItem(
      "sqlEditorState",
      JSON.stringify({
        tasksCompleted,
        currentQuestion,
        points,
        badges,
      })
    );
  }, [tasksCompleted, currentQuestion, points, badges]);

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

  const executeQuery = async (userQuery) => {
    try {
      const response = await fetch(`${apiUrl}/execute-query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userQuery }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data.results);
        checkAnswer(data.results);
      } else {
        setResult([{ error: "Error executing query" }]);
      }
    } catch (error) {
      console.error("Error:", error);
      setResult([{ error: "Error connecting to server" }]);
    }
  };

  const checkAnswer = useCallback(
    (userResult) => {
      if (JSON.stringify(userResult) === JSON.stringify(correctAnswerResult)) {
        const timeTaken = (Date.now() - startTime) / 1000;
        console.log(`Time taken to complete question: ${timeTaken} seconds`);

        setImageState("helpful");
        setMessage("Good job!");

        setPoints((prevPoints) => {
          const newPoints = prevPoints + 50;
          if (newPoints >= 100) {
            const badgeNumber = badges.length + 1; // Use length of badges for uniqueness
            const newBadge = `Achievement ${badgeNumber}`;
            setBadges((prevBadges) =>
              prevBadges.includes(newBadge)
                ? prevBadges
                : [...prevBadges, newBadge]
            );
            return 0; // Reset points
          }
          return newPoints;
        });

        triggerConfetti();
        setTimeout(() => {
          setTasksCompleted((prev) => prev + 1);
          loadQuestion();
        }, 3000);
      } else {
        setImageState("happy");
        setMessage("Try again");
        setTimeout(() => {
          setMessage(`Current Task: ${currentQuestion.question}`);
        }, 2000);
      }
    },
    [correctAnswerResult, startTime, loadQuestion, badges, currentQuestion]
  );

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="sql-editor-container">
      <LeftSidebar imageState={imageState} message={message} />
      <div className="main-editor">
        <Editor
          setQuery={setQuery}
          query={query}
          executeQuery={executeQuery}
          buttonsDisabled={buttonsDisabled}
        />
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
        badges={badges}
        question={currentQuestion.question || "No question available"}
      />
    </div>
  );
};

export default SQLEditor;
