const mongoose = require("mongoose");

const CheatLogSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  action: String,
  reason: String,
  roomId: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CheatLog", CheatLogSchema);