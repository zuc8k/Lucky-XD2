const redis = require("../config/redis");

module.exports = async (req, res, next) => {
  const key = `rate:${req.ip}`;

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60);
  }

  if (count > 100) {
    return res.status(429).json({
      msg: "Too many requests"
    });
  }

  next();
};