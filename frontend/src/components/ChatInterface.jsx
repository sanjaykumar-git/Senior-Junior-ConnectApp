import { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import "../styles/chat.css";

const socket = io("http://localhost:5000");

export default function ChatInterface({ user }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/chat/messages").then((res) => setMessages(res.data));
    axios.get(`http://localhost:5000/users/all?userId=${user._id}`).then((res) => setUsers(res.data));

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.emit("join", user.name);

    socket.on("updateUsers", (activeUsers) => {
      setUsers(activeUsers);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("updateUsers");
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

  return (
    <div className="chat-container">
      <div className="sidebar">
        <h3>Connections</h3>
        <ul>
          {users.map((u) => (
            <li key={u._id}>{u.name} ({u.role})</li>
          ))}
        </ul>
      </div>

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
