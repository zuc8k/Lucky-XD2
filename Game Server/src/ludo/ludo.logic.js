const CONFIG = require("./ludo.config");

exports.canMove = (piece, dice) => {
  if (piece.finished) return false;
  if (piece.pos === -1 && dice !== 6) return false;
  return true;
};

exports.movePiece = (piece, dice, color) => {
  if (piece.pos === -1 && dice === 6) {
    piece.pos = CONFIG.START_POS[color];
    return piece.pos;
  }

  piece.pos += dice;

  if (piece.pos >= CONFIG.FINISH_POS) {
    piece.finished = true;
    piece.pos = CONFIG.FINISH_POS;
  }

  return piece.pos;
};

exports.checkKill = (players, currentColor, pos) => {
  for (let p of players) {
    if (p.color === currentColor) continue;

    for (let piece of p.pieces) {
      if (
        piece.pos === pos &&
        !CONFIG.SAFE_CELLS.includes(pos)
      ) {
        piece.pos = -1;
        return true;
      }
    }
  }
  return false;
};

exports.checkWin = (player) => {
  return player.pieces.every(p => p.finished);
};