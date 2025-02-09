import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import "../../styles/Authentication.css";
import { useAuth } from "./AuthContext";


// const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const auth = useAuth();

  if(auth.user){
    if(auth.user.quizData)
      return <Navigate to="/SQLEditor" replace />;

    return <Navigate to="/quiz" replace />;
  }
    

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    auth.login(formData);
  };

  return (
    <section className="log-section">
      <div className="log-box">
        <div className="log-text">
          <h1>NEXUS</h1>
          <p>Log in</p>
          <p>Don't have account yet? <Link to="/register">Sign up</Link></p>
        </div>
        <div className="log-options">
          <form onSubmit={handleSubmit} className="log-form-box">
            <input 
              type="text" 
              placeholder="Email address*" 
              id="username"
              name="username"
              onChange={handleChange}
              required/>

            <input 
              type="password" 
              placeholder="Password*" 
              id="password"
              name="password"
              onChange={handleChange}
              required/>
            <button>Continue</button>
          </form>

          <div className="log-divider">
            <span>OR</span>
          </div>

          <div className="log-btns-container">
            <button className="log-btns" onClick={() => auth.googleOauth()}>
              <span>Login with</span>
              <img className="google-logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png" alt="google-logo"/>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login;
