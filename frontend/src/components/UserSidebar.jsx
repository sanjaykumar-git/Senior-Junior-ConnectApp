import { useEffect, useState } from "react";
import axios from "axios";
import { Menu } from "lucide-react"; // Importing the hamburger menu icon
import "../styles/chat.css";
import "../styles/userSidebar.css";

export default function UserSidebar() {
  const [users, setUsers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Open by default on large screens
  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token || !storedUser || !storedUser._id) {
      console.error("No token or user ID found, skipping API call.");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users/all", {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId: storedUser._id },
        });

        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [token, storedUser]);

  return (
    <div className="user-sidebar-container">
      {/* Hamburger Icon (Placed outside for better visibility) */}
      <button
        className="hamburger-menu"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu size={28} color="white" />
      </button>

      {/* Sidebar */}
      <div className={`user-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <h3>Users</h3>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user._id} className="user-item">
                {user.name} ({user.role})
                <button className="connect-btn">Connect</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
}
