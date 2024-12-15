import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Authentication.css";

function Register() {
  return (
    <section className="log-section">
      <div className="log-box">
        <div className="log-text">
          <h1>SQL Game</h1>
          <p>Sign up</p>
          <p>Already have an account yet? <Link to="/">Sign in</Link></p>
        </div>
        <div className="log-options">
          <form action="" className="log-form-box">
            <input type="text" placeholder="Email address*" />
            <input type="password" placeholder="Password*" />
            <button>Continue</button>
          </form>

          <div className="log-divider">
            <span>OR</span>
          </div>

          <div className="log-btns-container">
            <button className="log-btns">Sign up with Google</button>
            <button className="log-btns">Sign up with Facebook</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Register;
