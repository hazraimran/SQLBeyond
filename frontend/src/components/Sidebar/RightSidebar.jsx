import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../../styles/RightSidebar.css";
import AIAssistant from "./AIAssistant";
import DifficultyChart from "../DifficultyChart"; // Import the chart
import { useAuth } from "../Login/AuthContext";

import joinExpert from '../../assets/badges/join-expert.png';
import levelUp from '../../assets/badges/level-up.png';
import logicPro from '../../assets/badges/logic-pro.png';
import noHintHero from '../../assets/badges/no-hint-hero.png';
import persistentLearner from '../../assets/badges/persistent-learner.png';
import quickSolver from '../../assets/badges/quick-solver.png';
import reflectiveThinker from '../../assets/badges/reflective-thinker.png';
import sqlChampion from '../../assets/badges/sql-champion.png';
import steadyProgress from '../../assets/badges/steady-progress.png';
import syntaxMaster from '../../assets/badges/syntax-master.png';


const badgesData = [
  {
    name: "joinExpert",
    criteria: "Successfully complete a task using SQL JOINs.",
    badge: joinExpert,
  },
  {
    name: "levelUp",
    criteria: "Progress to the next proficiency level (e.g., Beginner → Intermediate).",
    badge: levelUp,
  },
  {
    name: "logicPro",
    criteria: "Solve 3 consecutive tasks using logical operators (AND, OR, NOT).",
    badge: logicPro,
  },
  {
    name: "noHintHero",
    criteria: "Solve 3 consecutive tasks without using hints.",
    badge: noHintHero,
  },
  {
    name: "persistentLearner",
    criteria: "Solve a task successfully after 3+ incorrect attempts.",
    badge: persistentLearner,
  },
  {
    name: "quickSolver",
    criteria: "Solve a query in under 2 minutes.",
    badge: quickSolver,
  },
  {
    name: "reflectiveThinker",
    criteria: "Answer reflective feedback questions correctly after solving a query.",
    badge: reflectiveThinker,
  },
  {
    name: "sqlChampion",
    criteria: "Complete all challenges in the game.",
    badge: sqlChampion,
  },
  {
    name: "steadyProgress",
    criteria: "Complete 3 tasks within a single session.",
    badge: steadyProgress,
  },
  {
    name: "syntaxMaster",
    criteria: "Solve 5 tasks without any syntax errors.",
    badge: syntaxMaster,
  },
];

const RightSidebar = ({
  progress,
  setProgress,
  query,
  taskDescription,
  retries,
  badges,
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


  // -> display badge with color 
  // dumping some ideas i have in mind so that I don't forget
  // the logic for this is not very good, make it work first for now, but then improve how it is working.
  // load the badges the users have in the SQLEditor, and then from the manipulate the badges individually
  // make a post request to the api, update it in the database, in case the user reloads, it loads the page with the most recent badges
  // think about this for the point system as well.
  // the user from AuthContext should be used only to manipulate the user data, not individual parts of the user data

  // when user clicks in the badge, open a modal with the image, the name, and how to get it.
  const [userBadges, setUserBadges] = useState([]);
  useEffect(() => {
    if(auth.user.badges){
      setUserBadges(auth.user.badges);
    }
  }, [auth.user.badges]);
  useEffect(() => {
    if(auth.user.badges){
      setUserBadges(auth.user.badges);
    }
  }, []);

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
                  <div key={badge.name} className={`badge-container ${userBadges.includes(badge.name)? "" : "gray-image"}`}>
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
