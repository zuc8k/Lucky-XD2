const { createClient } = require("redis");

const redis = createClient({
  url: "redis://127.0.0.1:6379"
});

redis.connect()
  .then(() => console.log("⚡ Redis Connected"))
  .catch(console.error);

module.exports = redis;