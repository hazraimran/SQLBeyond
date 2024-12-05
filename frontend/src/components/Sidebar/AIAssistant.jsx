import { useState, useEffect } from "react";
import "../../styles/AIAssistant.css";
import { FaRobot } from "react-icons/fa"; // Import a robot icon for a more intuitive design
import axios from "axios";
import PropTypes from "prop-types";

const AIAssistant = ({ question }) => {
  const [message, setMessage] = useState("Need help? I’m here for you!");
  const [response, setResponse] = useState(""); // Store the AI response
  const [hintUsed, setHintUsed] = useState(false); // Track if the hint has been used
  const [showCard, setShowCard] = useState(false); // Track card visibility

  // Reset the hint state when the question changes
  useEffect(() => {
    setHintUsed(false);
    setShowCard(false);
    setResponse("");
    setMessage("Need help? I’m here for you!");
  }, [question]);

  const handleGetHint = async () => {
    if (!question) {
      setMessage("No question available to send. Please load a task first.");
      return;
    }

    const prompt = `Help me write this query: ${question}`; // Use the passed question in the prompt

    try {
      const res = await axios.post("http://localhost:5001/generate-sql", {
        prompt,
      });

      // console.log("AI Full Response:", res.data.response);

      const fullResponse = res.data.response;
      const cleanResponse = fullResponse.replace(prompt, "").trim();

      console.log("Cleaned Response:", cleanResponse);

      setResponse(cleanResponse); // Set only the cleaned response
      setMessage("Here's what I came up with!");
      setHintUsed(true); // Mark hint as used
      setShowCard(true); // Show the animated card
    } catch (err) {
      console.error(
        "Error fetching AI response:",
        err.response?.data || err.message
      );
      setMessage("Sorry, something went wrong. Please try again later.");
    }
  };

  const handleCloseCard = () => {
    setShowCard(false); // Close the card
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
          {!hintUsed ? (
            <button className="help-button" onClick={handleGetHint}>
              Get Hint
            </button>
          ) : (
            <button
              className="show-hint-button"
              onClick={() => setShowCard(true)}
            >
              Show Hint
            </button>
          )}
          <button
            className="encourage-button"
            onClick={() => setMessage("You're doing great! Keep it up!")}
          >
            Encourage Me
          </button>
        </div>
      </div>
      {showCard && (
        <div className="hint-card">
          <div className="hint-card-content">
            <h5>Generated Query:</h5>
            <p>{response}</p>
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
  question: PropTypes.string.isRequired,
};

export default AIAssistant;
