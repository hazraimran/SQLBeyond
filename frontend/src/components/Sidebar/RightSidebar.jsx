import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../styles/RightSidebar.css";
import AIAssistant from "./AIAssistant";

// const RightSidebar = ({ progress, badges, generatedQuery }) => {
const RightSidebar = ({ progress, badges, question }) => {
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
};

export default RightSidebar;
