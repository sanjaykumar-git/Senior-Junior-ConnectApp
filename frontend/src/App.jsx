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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Save user info
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Clear user session
  };

  return (
    <Router>
      <Routes>
        {/* If user is logged in, show Chat Page; otherwise redirect to Login */}
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

        {/* Login Route */}
        <Route path="/login" element={<Login setUser={handleLogin} />} />

        {/* Signup Route */}
        <Route path="/signup" element={<Signup setUser={handleLogin} />} />

        {/* Catch-all route to redirect unknown paths */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}
