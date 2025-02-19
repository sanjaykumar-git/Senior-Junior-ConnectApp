const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const users = await User.find(
      { _id: { $ne: new mongoose.Types.ObjectId(userId) } },
      "_id name email role"
    );

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
