// import { useState } from "react";
// import "../../styles/AIAssistant.css";
// import { FaRobot } from "react-icons/fa"; // Import a robot icon for a more intuitive design
// import axios from "axios";

// const AIAssistant = () => {
//   const [message, setMessage] = useState("Need help? I’m here for you!");
//   const [response, setResponse] = useState(""); // Store the AI response

//   const handleSubmit = async () => {
//     const prompt = "Generate a SQL query to display names of all employees.";

//     try {
//       const res = await axios.post("http://localhost:5001/generate-sql", {
//         prompt,
//       });
//       console.log("AI Response:", res.data.response); // Log the AI response
//       setResponse(res.data.response); // Update the response
//       setMessage("Here's what I came up with!"); // Update the message
//     } catch (err) {
//       console.error(
//         "Error fetching AI response:",
//         err.response?.data || err.message
//       );
//       setMessage("Sorry, something went wrong. Please try again later.");
//     }
//   };

//   return (
//     <div className="ai-assistant">
//       <div className="assistant-header">
//         <FaRobot className="assistant-icon" />
//         <h4>AI Assistant</h4>
//       </div>
//       <div className="assistant-message">
//         <p>{message}</p>
//         <div className="assistant-buttons">
//           <button className="help-button" onClick={handleSubmit}>
//             Get Hint
//           </button>
//           <button
//             className="encourage-button"
//             onClick={() => setMessage("You're doing great! Keep it up!")}
//           >
//             Encourage Me
//           </button>
//         </div>
//       </div>
//       {response && (
//         <div className="assistant-response">
//           <p>{response}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AIAssistant;

import { useState } from "react";
import "../../styles/AIAssistant.css";
import { FaRobot } from "react-icons/fa"; // Import a robot icon for a more intuitive design
import axios from "axios";
import PropTypes from "prop-types";

const AIAssistant = ({ question }) => {
  const [message, setMessage] = useState("Need help? I’m here for you!");
  const [response, setResponse] = useState(""); // Store the AI response

  // const handleSubmit = async () => {
  //   if (!question) {
  //     setMessage("No question available to send. Please load a task first.");
  //     return;
  //   }
  //   console.log("questing", question);
  //   const prompt = `Help me write this query: ${question}`; // Use the passed question in the prompt

  //   try {
  //     const res = await axios.post("http://localhost:5001/generate-sql", {
  //       prompt,
  //     });
  //     console.log("AI Response:", res.data.response); // Log the AI response
  //     setResponse(res.data.response); // Update the response
  //     setMessage("Here's what I came up with!"); // Update the message
  //   } catch (err) {
  //     console.error(
  //       "Error fetching AI response:",
  //       err.response?.data || err.message
  //     );
  //     setMessage("Sorry, something went wrong. Please try again later.");
  //   }
  // };

  const handleSubmit = async () => {
    if (!question) {
      setMessage("No question available to send. Please load a task first.");
      return;
    }

    const prompt = `Help me write this query: ${question}`; // Use the passed question in the prompt

    try {
      const res = await axios.post("http://localhost:5001/generate-sql", {
        prompt,
      });

      console.log("AI Full Response:", res.data.response);

      // Remove the echoed question from the response
      const fullResponse = res.data.response;
      const cleanResponse = fullResponse.replace(prompt, "").trim();

      console.log("Cleaned Response:", cleanResponse);

      setResponse(cleanResponse); // Set only the cleaned response
      setMessage("Here's what I came up with!"); // Update the message
    } catch (err) {
      console.error(
        "Error fetching AI response:",
        err.response?.data || err.message
      );
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
          <h5>Generated Query:</h5>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

AIAssistant.propTypes = {
  question: PropTypes.object.isRequired,
};

export default AIAssistant;
