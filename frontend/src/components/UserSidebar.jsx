import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/chat.css";

export default function UserSidebar({ currentUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!currentUser || !currentUser._id) return;

    axios
      .get(`http://localhost:5000/users/all?userId=${currentUser._id}`)
      .then((res) => {
        setUsers(res.data);
        console.log("Fetched users:", res.data);
        console.log("Current User ID:", currentUser?._id);

      })
      .catch((err) => console.error("Error fetching users:", err));
  }, [currentUser]);

  return (
    <div className="user-sidebar">
      <h3>Available Users</h3>
      {users.length === 0 ? (
        <p>No users available</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id} className="user-item">
              <span>{user.name} ({user.role})</span>
              <button className="connect-btn">Connect</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
