// --- Login.jsx ---
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/loginSignup.css"

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Both email and password are required!");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      alert("Login successful! Redirecting to dashboard...");
      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <div className="error-message">{error}</div>}
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      <p>
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          style={{ cursor: "pointer", color: "blue" }}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
}
