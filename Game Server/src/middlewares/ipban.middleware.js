const IPBan = require("../models/IPBan");

module.exports = async (req, res, next) => {
  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress;

  const banned = await IPBan.findOne({ ip });
  if (banned) {
    return res.status(403).json({
      msg: "IP banned"
    });
  }

  next();
};