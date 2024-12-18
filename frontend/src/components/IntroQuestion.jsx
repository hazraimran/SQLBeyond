import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/IntroQuestion.css";

import { useAuth } from "../components/Login/AuthContext";

function IntroQuestion() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const auth = useAuth();

  const companies = ["Apple", "Microsoft", "Amazon"];
  const positions = ["Software Developer", "Data Analyst", "Product Manager"];

  const handleLogout = () => {
    auth.logout();
  }

  const handleSubmit = (e) => {

    e.preventDefault();
    if (name && company && position) {
      setSubmitted(true);
      const userData = { name, company, position };
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      alert(
        "Please fill in your name, select a company, and a position before submitting."
      );
    }
  };

  const startQuiz = () => {
    navigate("/query");
  };

  return (
    <div className="story-intro">
      {!submitted ? (
        <div className="application-form">
          <h1>Apply for a Position</h1>
          <form onSubmit={handleSubmit}>
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

          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="application-result">
          <h1>Application Submitted</h1>
          <p>
            <strong>{name}</strong>, you are applying for the position of{" "}
            <strong>{position}</strong> at <strong>{company}</strong>.
          </p>
          <button onClick={startQuiz}>Start Quiz</button>
        </div>
      )}
    </div>
  );
}

export default IntroQuestion;
