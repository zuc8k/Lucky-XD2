const redis = require("../config/redis");

const QUEUE_KEY = "matchmaking:ludo";
const MAX_PLAYERS = 4;

exports.joinQueue = async (io, socket) => {
  await redis.rPush(QUEUE_KEY, socket.id);

  const count = await redis.lLen(QUEUE_KEY);

  if (count >= MAX_PLAYERS) {
    const players = await redis.lPopCount(
      QUEUE_KEY,
      MAX_PLAYERS
    );

    const roomId = "ROOM_" + Date.now();

    players.forEach(id => {
      const s = io.sockets.sockets.get(id);
      if (s) {
        s.join(roomId);
        s.emit("match_found", roomId);
      }
    });

    console.log("🎯 Redis Match Created:", roomId);
  }
};