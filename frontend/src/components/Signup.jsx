import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/loginSignup.css";

export default function Signup({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("junior");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError("All fields are required!");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/auth/signup", {
        name,
        email,
        password,
        role,
      });
      alert("Signup successful! Redirecting to login...");
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="junior">Junior</option>
        <option value="senior">Senior</option>
      </select>
      {error && <div className="error-message">{error}</div>}
      <button onClick={handleSignup} disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </button>
      <p>
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          style={{ cursor: "pointer", color: "blue" }}
        >
          Login
        </span>
      </p>
    </div>
  );
}
