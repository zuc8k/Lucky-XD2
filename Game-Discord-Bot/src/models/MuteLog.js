const mongoose = require("mongoose");

const MuteLogSchema = new mongoose.Schema({
  userId: String,        // uid
  byAdmin: String,       // admin uid
  reason: String,
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("MuteLog", MuteLogSchema);