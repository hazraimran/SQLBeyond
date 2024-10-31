import { useState } from "react";
import "../styles/IntroQuestion.css"; // Assuming you have some styling
import { useNavigate } from "react-router-dom";

function IntroQuestion() {
  const [name, setName] = useState(""); // Track user's name
  const [company, setCompany] = useState(""); // Track selected company
  const [position, setPosition] = useState(""); // Track selected position
  const [submitted, setSubmitted] = useState(false); // Track form submission
  const navigate = useNavigate(); // To navigate to another route

  const companies = ["Apple", "Microsoft", "Amazon"];
  const positions = ["Software Developer", "Data Analyst", "Product Manager"];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check that all fields (name, company, position) are filled
    if (name && company && position) {
      setSubmitted(true); // Mark form as submitted to show result
    } else {
      alert(
        "Please fill in your name, select a company, and a position before submitting."
      );
    }
  };

  const continueGame = () => {
    // Send data to the "/query" route
    navigate("/query", {
      state: {
        name,
        company,
        position,
      },
    });
  };

  return (
    <div className="story-intro">
      {!submitted ? (
        // Form to choose company, position, and enter name
        <div className="application-form">
          <h1>Apply for a Position</h1>
          <form onSubmit={handleSubmit}>
            {/* Name input field */}
            <div className="form-group">
              <label htmlFor="name">Enter Your Name:</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Full Name"
              />
            </div>

            {/* Company selection */}
            <div className="form-group">
              <label htmlFor="company">Select Company:</label>
              <select
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              >
                <option value="">-- Select Company --</option>
                {companies.map((comp, index) => (
                  <option key={index} value={comp}>
                    {comp}
                  </option>
                ))}
              </select>
            </div>

            {/* Position selection */}
            <div className="form-group">
              <label htmlFor="position">Select Position:</label>
              <select
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                <option value="">-- Select Position --</option>
                {positions.map((pos, index) => (
                  <option key={index} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit">Submit Application</button>
          </form>
        </div>
      ) : (
        // Display selected name, company, and position after submission
        <div className="application-result">
          <h1>Application Submitted</h1>
          <p>
            <strong>{name}</strong>, you are applying for the position of{" "}
            <strong>{position}</strong> at <strong>{company}</strong>.
          </p>
          <button onClick={continueGame}>Continue</button>
        </div>
      )}
    </div>
  );
}

export default IntroQuestion;

// StoryIntro
