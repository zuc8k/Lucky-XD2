const mongoose = require("mongoose");

const HWIDBanSchema = new mongoose.Schema({
  hwid: String,
  reason: String,
  bannedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("HWIDBan", HWIDBanSchema);