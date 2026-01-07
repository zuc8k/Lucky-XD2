const { v4: uuid } = require("uuid");

const QUEUES = { 2: [], 4: [] };
const ROOMS = {};

exports.ROOMS = ROOMS;

exports.joinQueue = (io, socket, user, playersCount) => {
  const queue = QUEUES[playersCount];
  if (!queue) return;

  if (queue.some(p => p.socketId === socket.id)) return;

  queue.push({
    socketId: socket.id,
    userId: user.id
  });

  socket.emit("queue_joined", {
    mode: playersCount,
    count: queue.length
  });

  if (queue.length >= playersCount) {
    const roomId = "ROOM_" + uuid().slice(0, 6);

    ROOMS[roomId] = {
      id: roomId,
      players: []
    };

    for (let i = 0; i < playersCount; i++) {
      const player = queue.shift();
      ROOMS[roomId].players.push(player);

      const s = io.sockets.sockets.get(player.socketId);
      if (s) {
        s.join(roomId);
        s.emit("match_found", { roomId });
      }
    }

    console.log("🎯 MATCH CREATED:", roomId);
  }
};

exports.leaveQueue = (socket) => {
  Object.values(QUEUES).forEach(queue => {
    const i = queue.findIndex(p => p.socketId === socket.id);
    if (i !== -1) queue.splice(i, 1);
  });
};