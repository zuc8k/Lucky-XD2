const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  name: String,
  description: String,

  startAt: Date,
  endAt: Date,

  rewardCoins: Number,
  rewardRP: Number,

  matchesPlayed: { type: Number, default: 0 },
  participants: { type: Number, default: 0 },

  active: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);