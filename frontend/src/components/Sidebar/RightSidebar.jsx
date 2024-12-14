import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../styles/RightSidebar.css";
import AIAssistant from "./AIAssistant";
import DifficultyChart from "../DifficultyChart"; // Import the chart

const RightSidebar = ({ progress, badges, question, pointsData }) => {
  const [hintsUsed, setHintsUsed] = useState(0);
  const [displayFullProgress, setDisplayFullProgress] = useState(false);

  const handleUseHint = () => {
    if (hintsUsed < 3) {
      setHintsUsed((prev) => prev + 1);
    }
  };

  // Calculate the percentage of progress toward the next achievement
  const progressPercentage = (progress / 100) * 100;

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
        <h3>Points</h3>
        <p>
          <strong>Current Points:</strong> {progress} / 100
        </p>
        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: displayFullProgress ? "100%" : `${progressPercentage}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Difficulty Chart */}
      <div className="difficulty-chart">
        <h3>Performance</h3>
        <DifficultyChart pointsData={pointsData} />
      </div>

      {/* Achievements */}
      <div className="achievements">
        <h3>Achievements</h3>
        {badges.map((badge, index) => (
          <div key={index} className="badge">
            <span>{badge}</span>
          </div>
        ))}
      </div>

      {/* AI Assistant */}
      <AIAssistant
        handleUseHint={handleUseHint}
        hintsUsed={hintsUsed}
        maxHints={3}
        question={question}
      />
    </div>
  );
};

// Prop validation
RightSidebar.propTypes = {
  progress: PropTypes.number.isRequired,
  badges: PropTypes.arrayOf(PropTypes.string).isRequired,
  question: PropTypes.string.isRequired,
  pointsData: PropTypes.object.isRequired, // Add validation for pointsData
};

export default RightSidebar;
