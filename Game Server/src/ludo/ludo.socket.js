const createPlayer = require("./ludo.state");
const logic = require("./ludo.logic");
const antiCheat = require("../antiCheat/validator");

const User = require("../models/User");
const rankLogic = require("../rank/rank.logic");

// ================== ACTIVE GAMES ==================
const games = {};

module.exports = (io, socket) => {

  /* =====================================================
     🎮 CREATE GAME
  ===================================================== */
  socket.on("ludo_create", ({ color, userId }) => {
    const room = "LUDO_" + Date.now();

    games[room] = {
      status: "waiting", // waiting | playing | finished
      players: [
        {
          userId,
          socketId: socket.id,
          ...createPlayer(color)
        }
      ],
      turn: 0,
      lastDice: null,
      startedAt: new Date(),
      moves: 0
    };

    socket.join(room);
    socket.emit("ludo_created", { room });
  });

  /* =====================================================
     ➕ JOIN GAME
  ===================================================== */
  socket.on("ludo_join", ({ room, color, userId }) => {
    const game = games[room];
    if (!game || game.status !== "waiting") return;

    game.players.push({
      userId,
      socketId: socket.id,
      ...createPlayer(color)
    });

    game.status = "playing";
    socket.join(room);

    io.to(room).emit("ludo_start", {
      players: game.players.map(p => ({
        userId: p.userId,
        color: p.color,
        pieces: p.pieces
      })),
      turn: game.turn
    });
  });

  /* =====================================================
     🎲 ROLL DICE (SERVER AUTHORITATIVE)
  ===================================================== */
  socket.on("ludo_roll", ({ room, userId }) => {
    const game = games[room];
    if (!game || game.status !== "playing") return;

    const player = game.players[game.turn];

    // ❌ محاولة لعب مش دوره
    if (player.userId !== userId) {
      antiCheat.invalidMove({
        userId,
        action: "ROLL",
        reason: "Rolling out of turn",
        roomId: room
      });
      return;
    }

    const dice = Math.floor(Math.random() * 6) + 1;
    game.lastDice = dice;

    io.to(room).emit("ludo_dice", {
      dice,
      userId
    });
  });

  /* =====================================================
     ♟ MOVE PIECE
  ===================================================== */
  socket.on("ludo_move", async ({ room, pieceIndex, userId }) => {
    const game = games[room];
    if (!game || game.status !== "playing") return;

    const player = game.players[game.turn];
    const dice = game.lastDice;

    // ❌ لعب بدون نرد
    if (!dice) return;

    // ❌ مش دوره
    if (player.userId !== userId) {
      await antiCheat.invalidMove({
        userId,
        action: "MOVE",
        reason: "Play out of turn",
        roomId: room
      });
      return;
    }

    const piece = player.pieces[pieceIndex];

    if (!logic.canMove(piece, dice)) {
      await antiCheat.invalidMove({
        userId,
        action: "MOVE",
        reason: "Illegal piece move",
        roomId: room
      });
      return;
    }

    /* ================== GAME LOGIC ================== */

    const newPos = logic.movePiece(piece, dice, player.color);

    const killed = logic.checkKill(
      game.players,
      player.color,
      newPos
    );

    game.moves++;
    game.lastDice = null;

    /* ================== WIN CHECK ================== */

    if (logic.checkWin(player)) {
      game.status = "finished";

      // 🏆 الفائز
      const winner = await User.findById(player.userId);
      winner.rankPoints += rankLogic.calculatePoints(true);
      winner.rank = rankLogic.getRank(winner.rankPoints);
      winner.wins += 1;
      await winner.save();

      // ❌ الخاسرين
      for (const p of game.players) {
        if (p.userId !== player.userId) {
          const loser = await User.findById(p.userId);
          loser.rankPoints += rankLogic.calculatePoints(false);
          if (loser.rankPoints < 0) loser.rankPoints = 0;
          loser.rank = rankLogic.getRank(loser.rankPoints);
          loser.loses += 1;
          await loser.save();
        }
      }

      io.to(room).emit("ludo_win", {
        winner: player.userId,
        color: player.color,
        rank: winner.rank,
        rankPoints: winner.rankPoints
      });

      delete games[room];
      return;
    }

    /* ================== NEXT TURN ================== */
    game.turn = (game.turn + 1) % game.players.length;

    io.to(room).emit("ludo_update", {
      players: game.players.map(p => ({
        userId: p.userId,
        color: p.color,
        pieces: p.pieces
      })),
      turn: game.turn,
      killed
    });
  });

  /* =====================================================
     ❌ DISCONNECT
  ===================================================== */
  socket.on("disconnect", () => {
    for (const room in games) {
      const game = games[room];

      game.players = game.players.filter(
        p => p.socketId !== socket.id
      );

      if (game.players.length === 0) {
        delete games[room];
      }
    }
  });

};