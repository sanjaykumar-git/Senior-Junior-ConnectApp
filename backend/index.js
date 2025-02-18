const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
require("dotenv").config();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const userRoutes = require("./routes/users");




const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/chat", chatRoutes);
app.use("/users", userRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/auth", authRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("sendMessage", (data) => io.emit("receiveMessage", data));
  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
