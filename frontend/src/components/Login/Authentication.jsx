import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Authentication.css";

// const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

function Authentication() {
  const navigate = useNavigate(); // To navigate to another route
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Here you could add authentication logic, e.g., API call
    console.log("Submitted:", formData);

    // Navigate to the intro page
    // navigate("/intro");
  };


  // return (
  //   <div className="auth-container">
  //     <div className="auth-card">
  //       <h1>Login</h1>
  //       <form onSubmit={handleSubmit}>
  //         <div className="form-group">
  //           <label htmlFor="username">Username</label>
  //           <input
  //             type="text"
              // id="username"
              // name="username"
  //             value={formData.username}
  //             onChange={handleChange}
  //             placeholder="Enter your username"
  //             required
  //           />
  //         </div>

  //         <div className="form-group">
  //           <label htmlFor="password">Password</label>
  //           <input
  //             type="password"
  //             id="password"
  //             name="password"
  //             value={formData.password}
  //             onChange={handleChange}
  //             placeholder="Enter your password"
  //             required
  //           />
  //         </div>

  //         <button type="submit" className="submit-button">
  //           Login
  //         </button>
  //       </form>
  //     </div>
  //   </div>
  // );

  // console.log(formData);

  return (
    <section className="log-section">
      <div className="log-box">
        <div className="log-text">
          <h1>SQL Game</h1>
          <p>Log in</p>
          <p>Don't have account yet? <Link to="/register">Sign up</Link></p>
        </div>
        <div className="log-options">
          <form action="" className="log-form-box">
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
            <button className="log-btns">Login with Google</button>
            <button className="log-btns">Login with Facebook</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Authentication;
