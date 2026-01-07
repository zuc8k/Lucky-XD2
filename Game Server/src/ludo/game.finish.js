const GameLog = require("../models/GameLog");

exports.saveGame = async ({
  roomId,
  players,
  winner,
  moves,
  start
}) => {
  await GameLog.create({
    roomId,
    players,
    winner,
    totalMoves: moves,
    startedAt: start,
    endedAt: new Date()
  });
};