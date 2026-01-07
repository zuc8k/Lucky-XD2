const mongoose = require("mongoose");

const GameLogSchema = new mongoose.Schema({
  roomId: String,
  players: [String],
  winner: String,
  totalMoves: Number,
  startedAt: Date,
  endedAt: Date
});

module.exports = mongoose.model("GameLog", GameLogSchema);