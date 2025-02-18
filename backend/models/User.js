const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Email must be a valid @gmail.com address"] 
  },
  password: { 
    type: String, 
    required: true, 
    minlength: [6, "Password must be at least 6 characters long"]
  },
  role: { type: String, enum: ["junior", "senior"], required: true },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);