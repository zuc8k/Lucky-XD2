const rateLimit = require("express-rate-limit");

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 20, // 20 محاولة
  message: {
    msg: "Too many requests, try later"
  }
});

exports.apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100
});