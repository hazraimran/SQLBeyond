import { useState, useEffect } from "react";
import "../../styles/AIAssistant.css";
import { FaRobot } from "react-icons/fa";
import PropTypes from "prop-types";
import axios from "axios";

const AIAssistant = ({
  handleUseHint,
  hintsUsed,
  maxHints,
  taskDescription,
  query,
  retries,
}) => {
  const [message, setMessage] = useState("Need help? I’m here for you!");
  const [response, setResponse] = useState(""); // Current hint
  const [hints, setHints] = useState([]); // Store all provided hints
  const [currentStage, setCurrentStage] = useState(1); // Track the current hint stage
  const [showCard, setShowCard] = useState(false);
  const [showHintsList, setShowHintsList] = useState(false);

  useEffect(() => {
    setShowCard(false);
    setShowHintsList(false);
    setResponse("");
    setMessage("Need help? I’m here for you!");
    setHints([]);
    setCurrentStage(1); // Reset the stage when the task changes
  }, [taskDescription]);

  const getHintButtonColor = () => {
    switch (hintsUsed) {
      case 0:
        return "green";
      case 1:
        return "yellow";
      case 2:
        return "red";
      default:
        return "grey";
    }
  };

  const handleGetHint = async () => {
    if (!taskDescription || !query) {
      setMessage("Ensure your query and task description are available.");
      return;
    }

    if (hintsUsed >= maxHints) {
      setMessage("You have used all your hints!");
      return;
    }

    handleUseHint(); // Update the hint count.

    try {
      // Send the latest query to the backend for processing.
      const res = await axios.post("http://localhost:5001/get-hint", {
        userQuery: query, // Use the latest query value from props.
        taskDescription,
        retries,
        currentStage,
      });

      if (res.data.success) {
        const newHint = `Hint for Stage ${currentStage}: ${res.data.hint}`;
        setHints((prevHints) => [...prevHints, newHint]); // Append to hints list.
        setResponse(newHint); // Show the hint to the user.
        setMessage("Hint provided!");
        setShowCard(true);

        // Move to the next stage if applicable.
        if (currentStage < 3) {
          setCurrentStage((prevStage) => prevStage + 1);
        }
      } else {
        setMessage("Unable to fetch hint. Try again later.");
      }
    } catch (err) {
      console.error("Error fetching hint:", err.message);
      setMessage("Something went wrong. Please try again.");
    }
  };

  const handleGetAIHint = async () => {
    if (!taskDescription || !query) {
      setMessage("Ensure your query and task description are available.");
      return;
    }

    const prompt = `Generate a SQL query for the following task: "${taskDescription.question}".`;

    try {
      const res = await axios.post("http://localhost:5001/generate-sql", {
        prompt,
      });

      if (res.data.success) {
        setResponse(`AI Hint: ${res.data.response}`);
        setMessage("AI-generated hint provided!");
        setShowCard(true);
      } else {
        setMessage("Unable to fetch AI hint. Try again later.");
      }
    } catch (err) {
      console.error("Error fetching AI hint:", err.message);
      setMessage("Something went wrong. Please try again.");
    }
  };

  const handleViewHints = () => {
    setShowHintsList(true);
  };

  const handleCloseCard = () => {
    setShowCard(false);
    setShowHintsList(false);
  };

  return (
    <div className="ai-assistant">
      <div className="assistant-header">
        <FaRobot className="assistant-icon" />
        <h4>AI Assistant</h4>
      </div>
      <div className="assistant-message">
        <p>{message}</p>
        <div className="assistant-buttons">
          <button
            className="hint-button"
            onClick={handleGetHint}
            style={{ backgroundColor: getHintButtonColor() }}
          >
            Hints
          </button>
          <button
            className="ai-hint-button"
            onClick={handleGetAIHint}
            style={{ backgroundColor: "blue" }}
          >
            AI Hint
          </button>
          {hints.length > 0 && (
            <button className="view-hints-button" onClick={handleViewHints}>
              View Hints
            </button>
          )}
        </div>
      </div>
      {showCard && (
        <div className="hint-card">
          <div className="hint-card-content">
            <h5>{`Hint (Stage ${currentStage - 1})`}</h5>
            <p>{response || "Your hint will appear here!"}</p>
            <button className="close-button" onClick={handleCloseCard}>
              Close
            </button>
          </div>
        </div>
      )}
      {showHintsList && (
        <div className="hints-list-card">
          <div className="hints-list-content">
            <h5>All Hints:</h5>
            <ul>
              {hints.map((hint, index) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
            <button className="close-button" onClick={handleCloseCard}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

AIAssistant.propTypes = {
  handleUseHint: PropTypes.func.isRequired,
  hintsUsed: PropTypes.number.isRequired,
  maxHints: PropTypes.number.isRequired,
  taskDescription: PropTypes.object.isRequired,
  query: PropTypes.string.isRequired,
  retries: PropTypes.number.isRequired,
};

export default AIAssistant;
