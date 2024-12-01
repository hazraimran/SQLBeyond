import { useState } from "react";
import "../../styles/AIAssistant.css";
import { FaRobot } from "react-icons/fa"; // Import a robot icon for a more intuitive design
import axios from "axios";

const AIAssistant = () => {
  const [message, setMessage] = useState("Need help? I’m here for you!");
  const [response, setResponse] = useState(""); // Store the AI response

  const handleSubmit = async () => {
    const prompt = "Write a random short poem."; // Specify the prompt for a random poem

    try {
      const res = await axios.post("http://localhost:5001/chat", { prompt });
      console.log("AI Response:", res.data.response); // Log the AI response
      setResponse(res.data.response); // Update the response
      setMessage("Here's what I came up with!"); // Update the message
    } catch (err) {
      console.error("Error fetching AI response:", err);
      setMessage("Sorry, something went wrong. Please try again later.");
    }
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
          <button className="help-button" onClick={handleSubmit}>
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
      {response && (
        <div className="assistant-response">
          <h5>Generated Poem:</h5>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
