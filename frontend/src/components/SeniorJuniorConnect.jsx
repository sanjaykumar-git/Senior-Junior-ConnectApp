import { useState, useEffect } from "react"; 
import io from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import "../styles/chat.css";

const socket = io("http://localhost:5000");

export default function ChatInterface({ user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/chat/messages").then((res) => setMessages(res.data));

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.emit("join", user.name);

    return () => {
      socket.off("receiveMessage");
    };
  }, [user]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const msgData = { sender: user.name, text: message };
      socket.emit("sendMessage", msgData);
      setMessages((prev) => [...prev, msgData]);
      setMessage("");
    }
  };

  const handleLogout = () => {
    onLogout(); // Clears user session
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="chat-container">
      {/* Logout Button */}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      <UserSidebar currentUser={user} />
      
      <div className="chat-box">
        <div className="messages">
          {messages.map((msg, index) => (
            <p key={index} className={msg.sender === user.name ? "sent" : "received"}>
              <strong>{msg.sender}:</strong> {msg.text}
            </p>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
