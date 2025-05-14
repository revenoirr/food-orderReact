import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import "./LoginPage.scss";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button.jsx";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>{isLogin ? "Log in" : "Sign up"}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleAuth} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <div className="form-actions">
            <Button type="submit" variant="primary">
              {isLogin ? "Login" : "Create Account"}
            </Button>

            <Button type="button" variant="outlined" onClick={() => navigate("/")}>
              Cancel
            </Button>
          </div>
        </form>

        <div className="auth-toggle">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Log in"}
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
