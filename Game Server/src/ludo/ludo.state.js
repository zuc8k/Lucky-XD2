module.exports = function createPlayer(color) {
  return {
    color,
    pieces: [
      { pos: -1, finished: false },
      { pos: -1, finished: false },
      { pos: -1, finished: false },
      { pos: -1, finished: false }
    ]
  };
};