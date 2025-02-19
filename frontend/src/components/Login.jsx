import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/loginSignup.css";

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
    console.log("Logging in with:", email, password);

    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      console.log("Login successful:", res.data);

      if (res.data && res.data.user && res.data.token) {
        const { _id, name, email, role } = res.data.user; // ✅ Include `_id`
        const token = res.data.token;

        if (!_id) {
          throw new Error("User ID is missing in response!");
        }

        // ✅ Store `_id`, token & user details in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ _id, name, email, role }));

        setUser({ _id, name, email, role });

        alert("Login successful! Redirecting to dashboard...");
        navigate("/");
      } else {
        throw new Error("Invalid login response from server.");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Invalid credentials. Please try again."
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
