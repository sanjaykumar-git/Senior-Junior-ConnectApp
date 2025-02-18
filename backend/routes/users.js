const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Get all users excluding the current user
router.get("/all", async (req, res) => {
  try {
    const { userId } = req.query;
    const users = await User.find({ _id: { $ne: userId } }, "_id name email role");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;