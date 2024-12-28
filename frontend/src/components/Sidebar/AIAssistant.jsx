import { useState, useEffect } from "react";
import "../../styles/AIAssistant.css";
import { FaRobot } from "react-icons/fa";
import PropTypes from "prop-types";
import axios from "axios";

import logToCSV from "../../utils/logger";

const AIAssistant = ({
  handleUseHint,
  hintsUsed,
  maxHints,
  taskDescription,
  query,
  retries,
  errorHint,
}) => {
  const [message, setMessage] = useState("Need help? I’m here for you!");
  const [response, setResponse] = useState(""); // Current hint or error message
  const [hints, setHints] = useState([]); // Store all provided hints
  const [currentStage, setCurrentStage] = useState(1); // Track the current hint stage
  const [showCard, setShowCard] = useState(false); // Control hint/error card visibility
  const [showHintsList, setShowHintsList] = useState(false);

  // Reset card state and hints when the task description changes
  useEffect(() => {
    setShowCard(false);
    setShowHintsList(false);
    setResponse("");
    setMessage("Need help? I’m here for you!");
    setHints([]);
    setCurrentStage(1);
  }, [taskDescription]);

  // Display error hints dynamically in the same card
  useEffect(() => {
    if (errorHint) {
      const errorMessage = `Error: ${errorHint}`;
      setHints((prevHints) => [...prevHints, errorMessage]); // Add error to hints
      setResponse(errorMessage); // Display the error in the card
      setMessage("There was an issue with your query:");
      setShowCard(true); // Automatically display error hints
    }
  }, [errorHint]);

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

    handleUseHint(); // Deduct points for hints

    try {
      const res = await axios.post("http://localhost:5001/get-hint", {
        userQuery: query,
        taskDescription,
        retries,
        currentStage,
      });

      if (res.data.success) {
        const newHint = `Hint for Stage ${currentStage}: ${res.data.hint}`;
        setHints((prevHints) => [...prevHints, newHint]); // Append to hints list
        setResponse(newHint); // Show the new hint in the card
        setMessage("Hint provided!");
        setShowCard(true);
        logToCSV({
          timestamp: new Date().toISOString(),
          action: "Hint Used",
          hintType: "Standard", // Or "AI", "Personalized"
          currentQuery: query,
          retries,
          currentTask: taskDescription.question,
        });
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
        const aiHint = `AI Hint: ${res.data.response}`;
        setHints((prevHints) => [...prevHints, aiHint]); // Append AI hint to hints list
        setResponse(aiHint); // Display the AI hint in the card
        setMessage("AI-generated hint provided!");
        setShowCard(true);
        logToCSV({
          timestamp: new Date().toISOString(),
          action: "Hint Used",
          hintType: "AI", // Or "AI", "Personalized"
          currentQuery: query,
          retries,
          currentTask: taskDescription.question,
        });
      } else {
        setMessage("Unable to fetch AI hint. Try again later.");
      }
    } catch (err) {
      console.error("Error fetching AI hint:", err.message);
      setMessage("Something went wrong. Please try again.");
    }
  };

  // const handleGetPersonalizedHint = async () => {
  //   if (!query || !taskDescription?.answer) {
  //     setMessage(
  //       "Ensure both the user's query and the correct query are available."
  //     );
  //     return;
  //   }

  //   try {
  //     const res = await axios.post("http://localhost:5001/personalized-hint", {
  //       userQuery: query,
  //       correctQuery: taskDescription.answer,
  //     });

  //     if (res.data.success) {
  //       const personalizedHint = `Personalized Hint: ${res.data.response}`;
  //       setHints((prevHints) => [...prevHints, personalizedHint]); // Append personalized hint to hints list
  //       setResponse(personalizedHint); // Display the hint in the card
  //       setMessage("Personalized hint provided!");
  //       setShowCard(true);
  //     } else {
  //       setMessage("Unable to fetch personalized hint. Try again later.");
  //     }
  //   } catch (err) {
  //     console.error("Error fetching personalized hint:", err.message);
  //     setMessage("Something went wrong. Please try again.");
  //   }
  // };

  const handleGetPersonalizedHint = async (userQuery, defaultMessage) => {
    if (!query || !taskDescription?.answer) {
      setMessage(
        "Ensure both the user's query and the correct query are available."
      );
      return;
    }

    try {
      const res = await axios.post("http://localhost:5001/personalized-hint", {
        userQuery,
        correctQuery: taskDescription.answer,
      });

      if (res.data.success) {
        const personalizedHint = `Personalized Hint: ${res.data.response}`;
        setHints((prevHints) => [...prevHints, personalizedHint]); // Append hint to hints list
        setResponse(personalizedHint); // Show the hint in the card
        setMessage("Personalized hint provided!");
        setShowCard(true);
        logToCSV({
          timestamp: new Date().toISOString(),
          action: "Hint Used",
          hintType: "Personalized", // Or "AI", "Personalized"
          currentQuery: query,
          retries,
          currentTask: taskDescription.question,
        });
      } else {
        const fallbackMessage =
          defaultMessage || "Unable to fetch personalized hint.";
        setHints((prevHints) => [...prevHints, fallbackMessage]); // Append fallback message
        setResponse(fallbackMessage);
        setMessage(fallbackMessage);
        setShowCard(true);
      }
    } catch (error) {
      console.error("Error fetching personalized hint:", error);
      const errorMessage =
        "An error occurred while fetching the personalized hint.";
      setHints((prevHints) => [...prevHints, errorMessage]);
      setResponse(errorMessage);
      setMessage(errorMessage);
      setShowCard(true);
    }
  };

  const handleViewHints = () => {
    setShowHintsList(true); // Display all hints in the list
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
          <button
            className="personalized-hint-button"
            onClick={handleGetPersonalizedHint}
            style={{ backgroundColor: "purple" }}
          >
            Personalized Hint
          </button>
          {hints.length > 0 && (
            <button className="view-hints-button" onClick={handleViewHints}>
              View All Hints
            </button>
          )}
        </div>
      </div>

      {/* Hint/Error Card */}
      {showCard && (
        <div className="hint-card">
          <div className="hint-card-content">
            <h5>
              {response.startsWith("Error:")
                ? "Query Error"
                : `Hint (Stage ${currentStage - 1})`}
            </h5>
            <p>{response || "Your hint will appear here!"}</p>
            <button className="close-button" onClick={handleCloseCard}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hints List */}
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
  errorHint: PropTypes.string, // New prop for error hints
};

export default AIAssistant;
