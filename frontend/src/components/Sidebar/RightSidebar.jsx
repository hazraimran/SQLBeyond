import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../styles/RightSidebar.css";
import AIAssistant from "./AIAssistant";
import DifficultyChart from "../DifficultyChart"; // Import the chart
import { useAuth } from "../Login/AuthContext";

const RightSidebar = ({
  progress,
  setProgress,
  query,
  taskDescription,
  currentQuestionPoints, // Static points for the current question
  retries,
  badges,
  badgesData,
  openBadgeModal,
  pointsData,
  idealPoints,
  errorHint,
}) => {
  const [hintsUsed, setHintsUsed] = useState(0);
  const [displayFullProgress, setDisplayFullProgress] = useState(false);
  const [adjustedQuestionPoints, setAdjustedQuestionPoints] = useState(
    currentQuestionPoints || 0
  ); // Track points for the current question
  const auth = useAuth();

  // Update adjustedQuestionPoints when currentQuestionPoints changes
  useEffect(() => {
    setAdjustedQuestionPoints(currentQuestionPoints || 0);
  }, [currentQuestionPoints]);

  const handleLogout = () => {
    auth.logout();
  };

  const handleUseHint = () => {
    console.log("handleUseHint called in RightSidebar");
    setHintsUsed((prev) => prev + 1);
  };

  // Calculate the percentage of progress toward the next achievement
  // const progressPercentage = (progress / 100) * 100;

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
          <h3>Points</h3>
          <button onClick={handleLogout}>Logout</button>
        </span>
        <p>
          <strong>Current Points:</strong> {progress} / 100
        </p>
        <p>
          <strong>Points for this Question:</strong> {adjustedQuestionPoints}
        </p>
        {/* Progress Bar */}
        {/* <div className="progress-bar-container">
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: displayFullProgress ? "100%" : `${progressPercentage}%`,
              }}
            ></div>
          </div>
        </div> */}
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

      {/* Difficulty Chart */}
      <div className="difficulty-chart">
        <h3>Performance</h3>
        <DifficultyChart pointsData={pointsData} idealPoints={idealPoints} />
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
    </div>
  );
};

RightSidebar.propTypes = {
  progress: PropTypes.number.isRequired,
  setProgress: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  taskDescription: PropTypes.object.isRequired,
  currentQuestionPoints: PropTypes.number, // Static points for the current question
  retries: PropTypes.number.isRequired,
  badges: PropTypes.arrayOf(PropTypes.string).isRequired,
  badgesData: PropTypes.arrayOf(PropTypes.object).isRequired,
  openBadgeModal: PropTypes.func.isRequired,
  pointsData: PropTypes.object.isRequired,
  idealPoints: PropTypes.arrayOf(PropTypes.number).isRequired,
  errorHint: PropTypes.string,
  handleUseHint: PropTypes.func.isRequired, // Add PropType
};

export default RightSidebar;
