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
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
  }

  // Function to handle hints used and deduct points
  const handleUseHint = () => {
    if (hintsUsed < 3) {
      setHintsUsed((prev) => prev + 1);
      setProgress((prevProgress) => Math.max(prevProgress - 10, 0)); // Deduct 10 points
    }
  };

  useEffect(() => {
    console.log("This is the desc:", taskDescription);
  }, [taskDescription]);

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
        <span className="right-sidebar-header">
          <h3>Points</h3> 
          <button onClick={handleLogout}>Logout</button>
        </span>
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
                    className={`badge-container ${badges.includes(badge.name)? "" : "gray-image"}`}
                    onClick={() => openBadgeModal(badge)}
                  >
                    <img src={badge.badge} alt={badge.name}/>
                  </div>
                );
              })}
        </div>
        {/* {badges.map((badge, index) => (
          <div key={index} className="badge">
            <span>{badge}</span>
          </div>
        ))} */}
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
  retries: PropTypes.number.isRequired,
  badges: PropTypes.arrayOf(PropTypes.string).isRequired,
  pointsData: PropTypes.object.isRequired,
  idealPoints: PropTypes.arrayOf(PropTypes.number).isRequired,
  errorHint: PropTypes.string, // NEW PROP
};

export default RightSidebar;
