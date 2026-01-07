const mongoose = require("mongoose");

const WarnLogSchema = new mongoose.Schema({
  userId: String,        // uid
  byAdmin: String,       // admin uid
  reason: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("WarnLog", WarnLogSchema);