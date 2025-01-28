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
  const [showCard, setShowCard] = useState(false); // Control hint/error card visibility
  const [showModal, setShowModal] = useState(false); // Control modal visibility
  const [clickStage, setClickStage] = useState(0); // Track the click stage (0, 1, 2, ...)

  // Reset card state and hints when the task description changes
  useEffect(() => {
    setShowCard(false);
    setShowModal(false);
    setResponse("");
    setMessage("Need help? I’m here for you!");
    setHints([]);
    setClickStage(0); // Reset stage on new task
  }, [taskDescription]);

  // Display error hints dynamically in the same card
  useEffect(() => {
    if (errorHint) {
      const errorMessage = `Error: ${errorHint}`;
      setHints((prevHints) => [errorMessage, ...prevHints]); // Add error to hints
      setResponse(errorMessage); // Display the error in the card
      setMessage("There was an issue with your query:");
      setShowCard(true); // Automatically display error hints
    }
  }, [errorHint]);

  const handleHintSequence = () => {
    if (clickStage === 0) {
      handleGetHint();
    } else if (clickStage === 1) {
      handleGetAIHint();
    } else {
      handleGetPersonalizedHint();
    }
    handleUseHint(); // Deduct points for using hints
    setClickStage((prevStage) => (prevStage >= 2 ? 2 : prevStage + 1));
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
      });

      if (res.data.success) {
        const newHint = `Hint: ${res.data.hint}`;
        setHints((prevHints) => [newHint, ...prevHints]); // Append to hints list
        setResponse(newHint); // Show the new hint in the card
        setMessage("Hint provided!");
        setShowCard(true);
        logToCSV({
          timestamp: new Date().toISOString(),
          action: "Hint Used",
          hintType: "Standard",
          currentQuery: query,
          retries,
          currentTask: taskDescription.question,
        });
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

    const prompt = `Create a metaphorical hint for the SQL task: "${taskDescription.question}". The correct query is: "${taskDescription.answer}". The hint must:
- Use a meaningful metaphor.
- Be approximately under 30 words.
- Avoid repeating or rephrasing the query or task.
- Output only the hint without any additional explanation or context.
Hint:`;

    try {
      const res = await axios.post("http://localhost:5001/generate-sql", {
        prompt,
      });

      if (res.data.success) {
        const aiHint = `AI Hint: ${res.data.response}`;
        setHints((prevHints) => [aiHint, ...prevHints]); // Append AI hint to hints list
        setResponse(aiHint); // Display the AI hint in the card
        setMessage("AI-generated hint provided!");
        setShowCard(true);
        logToCSV({
          timestamp: new Date().toISOString(),
          action: "Hint Used",
          hintType: "AI",
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

  const handleGetPersonalizedHint = async () => {
    if (!query || !taskDescription?.answer) {
      setMessage(
        "Ensure both the user's query and the correct query are available."
      );
      return;
    }

    try {
      console.log("Fetching personalized hint for:", {
        userQuery: query,
        taskDescription: taskDescription,
      });

      const res = await axios.post("http://localhost:5001/personalized-hint", {
        userQuery: query,
        taskDescription: taskDescription,
      });

      if (res.data.success) {
        const personalizedHint = `Personalized Hint: ${res.data.response}`;
        setHints((prevHints) => [personalizedHint, ...prevHints]); // Append hint to hints list
        setResponse(personalizedHint); // Show the hint in the card
        setMessage("Personalized hint provided!");
        setShowCard(true);
        logToCSV({
          timestamp: new Date().toISOString(),
          action: "Hint Used",
          hintType: "Personalized",
          currentQuery: query,
          retries,
          currentTask: taskDescription.question,
        });
      } else {
        console.error("API Error:", res.data.error || "Unknown error");
        setMessage("Unable to fetch personalized hint.");
      }
    } catch (error) {
      console.error("Error fetching personalized hint:", error.message);
      setMessage("An error occurred while fetching the personalized hint.");
    }
  };

  const handleCloseCard = () => {
    setShowCard(false);
  };

  const handleToggleModal = () => {
    setShowModal((prev) => !prev);
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
            onClick={handleHintSequence}
            style={{
              backgroundColor:
                clickStage === 0
                  ? "green"
                  : clickStage === 1
                  ? "blue"
                  : "purple",
            }}
          >
            Get Hint
          </button>
          <button className="show-hints-button" onClick={handleToggleModal}>
            Show Hints
          </button>
        </div>
      </div>

      {/* Hint/Error Card */}
      {showCard && (
        <div className="hint-card">
          <div className="hint-card-content">
            <h5>{response.startsWith("Error:") ? "Query Error" : "Hint"}</h5>
            <p>{response || "Your hint will appear here!"}</p>
            <button className="close-button" onClick={handleCloseCard}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Hints Modal */}
      {showModal && (
        <div className="hints-modal">
          <div className="hints-modal-content">
            <h5>All Hints:</h5>
            <div
              className="hints-list"
              style={{ overflowY: "auto", maxHeight: "300px" }}
            >
              <ul>
                {hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </div>
            <button className="close-modal-button" onClick={handleToggleModal}>
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
