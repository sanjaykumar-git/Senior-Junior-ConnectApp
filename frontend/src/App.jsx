import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../src/components/Login.jsx";
import Signup from "../src/components/Signup.jsx";
import SeniorJuniorConnect from "../src/components/SeniorJuniorConnect.jsx";
import "./styles/style.css";

export default function App() {
  const [user, setUser] = useState(() => {
    // ✅ Read user from localStorage immediately on first render
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // ✅ Store user session
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user"); // ✅ Clear session
  };

  return (
    <Router>
      <Routes>
        {/* ✅ Show Chat if logged in, else redirect */}
        <Route
          path="/"
          element={
            user ? (
              <SeniorJuniorConnect user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* ✅ Pass setUser to Login and Signup */}
        <Route path="/login" element={<Login setUser={handleLogin} />} />
        <Route path="/signup" element={<Signup setUser={handleLogin} />} />

        {/* ✅ Catch-all route */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}
