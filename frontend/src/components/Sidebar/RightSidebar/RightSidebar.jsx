import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../../styles/RightSidebar.css";
import AIAssistant from "./AIAssistant";
import DifficultyChart from "./DifficultyChart"; // Import the chart

const RightSidebar = ({
  progress, // Current progress/points
  // setProgress, // Function to update progress/points
  query, // User's current query
  taskDescription, // Description of the current task/question
  currentQuestionPoints, // Points allocated to the current question
  retries, // Retry count for the current question
  badges, // List of earned badges
  badgesData, // Metadata for all available badges
  openBadgeModal, // Function to open badge modal
  openHintModal,
  pointsData, // Points distribution data for the chart
  idealPoints, // Ideal points for difficulty levels
  errorHint, // Error hints for AI Assistant
  // hintsUsedForQuestion, // Number of hints used for the current question
  setHintsUsedForQuestion, // Function to increment hints used for the current question
  user,
  openLogoutModal,
}) => {
  const [hintsUsed, setHintsUsed] = useState(0);
  const [displayFullProgress, setDisplayFullProgress] = useState(false);
  const [adjustedQuestionPoints, setAdjustedQuestionPoints] = useState(
    currentQuestionPoints || 0
  ); // Track points for the current question
  useEffect(() => {
    setAdjustedQuestionPoints(currentQuestionPoints || 0); // Reset points to the new question's points
    setHintsUsedForQuestion(0); // Reset hints used for the new question
  }, [currentQuestionPoints, setHintsUsedForQuestion, taskDescription]);

  const handleLogout = () => {
    openLogoutModal(true)
  };

  const handleUseHint = () => {
    setHintsUsedForQuestion((prev) => prev + 1);
    setAdjustedQuestionPoints((prevPoints) => Math.max(prevPoints - 1, 0)); // Deduct 1 points for each hint
    console.log("Hint used! Points deducted.");
  };

  const progressPercentage = Math.min((progress / 100) * 100, 100); // Cap at 100%

  useEffect(() => {
    if (progress >= 100) {
      // Display 100% for 3 seconds, then reset back to the actual progress
      setDisplayFullProgress(true);
      const timer = setTimeout(() => {
        setDisplayFullProgress(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [progress, badges]);

  return (
    <div className="right-sidebar">
      {/* Points and Achievements */}
      <div className="points-system">
        <span className="right-sidebar-header">
          <h3>Hi, {`${user.firstName} ${user.lastName}`}</h3>
          <button onClick={handleLogout}>Logout</button>
        </span>

        <p>
          <strong>Current Points:</strong> {progress} / 100
        </p>
        <p>
          <strong>Points for this Question:</strong> {adjustedQuestionPoints}
        </p>
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: displayFullProgress ? "100%" : `${progressPercentage}%`,
                backgroundColor: progress >= 100 ? "green" : "#4caf50",
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="achievements">
        <h3>Achievements</h3>
        <div className="badges-container">
          {badgesData.map((badge) => {
            return (
              <div
                key={badge.name}
                className={`badge-container ${
                  badges.includes(badge.name) ? "" : "gray-image"
                }`}
                onClick={() => openBadgeModal(badge)}
              >
                <img src={badge.badge} alt={badge.name} />
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant
        handleUseHint={handleUseHint}
        hintsUsed={hintsUsed}
        maxHints={100}
        taskDescription={taskDescription}
        query={query}
        retries={retries}
        errorHint={errorHint} // Pass error hint
      />

      {/* Difficulty Chart */}
      <div className="difficulty-chart">
        <h3>Performance</h3>
        <DifficultyChart pointsData={pointsData} idealPoints={idealPoints} />
      </div>
    </div>
  );
};

RightSidebar.propTypes = {
  progress: PropTypes.number.isRequired,
  setProgress: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  taskDescription: PropTypes.object.isRequired,
  currentQuestionPoints: PropTypes.number.isRequired,
  retries: PropTypes.number.isRequired,
  badges: PropTypes.arrayOf(PropTypes.string).isRequired,
  badgesData: PropTypes.arrayOf(PropTypes.object).isRequired,
  openBadgeModal: PropTypes.func.isRequired,
  pointsData: PropTypes.object.isRequired,
  idealPoints: PropTypes.arrayOf(PropTypes.number).isRequired,
  errorHint: PropTypes.string,
  hintsUsedForQuestion: PropTypes.number.isRequired,
  setHintsUsedForQuestion: PropTypes.func.isRequired,
};

export default RightSidebar;
