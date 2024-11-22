// src/components/RightSidebar/AIAssistant.jsx
import { useState } from "react";
import "../../styles/AIAssistant.css";
import { FaRobot } from "react-icons/fa"; // Import a robot icon for a more intuitive design

const AIAssistant = () => {
  const [message, setMessage] = useState("Need help? I’m here for you!");

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
            className="help-button"
            onClick={() =>
              setMessage("Here's a hint! Try focusing on the syntax.")
            }
          >
            Get Hint
          </button>
          <button
            className="encourage-button"
            onClick={() => setMessage("You're doing great! Keep it up!")}
          >
            Encourage Me
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
