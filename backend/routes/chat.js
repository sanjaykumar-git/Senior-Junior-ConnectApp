const express = require("express");
const Message = require("../models/Message");
const User = require("../models/User");
const router = express.Router();

// Get all previous messages
router.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().populate("sender", "name");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users as connection requests
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "name email");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
