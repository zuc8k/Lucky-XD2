require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const path = require("path");

// ================== Core ==================
const connectDB = require("./config/database");
const { apiLimiter } = require("./middlewares/rateLimit.middleware");

// ================== Monitoring ==================
const logger = require("./utils/logger");
require("./utils/memory.watch");

// ================== App Init ==================
const app = express();

/* ✅🔥 الحل الأساسي للمشكلة */
app.set("trust proxy", 1);

const server = http.createServer(app);

// ================== Socket.io ==================
const io = new Server(server, {
  cors: { origin: "*" }
});

// ================== Database ==================
connectDB();

// ================== Middlewares ==================
app.use(cors());
app.use(express.json());

// 🛡️ Global API Rate Limit
app.use("/api", apiLimiter);

// ================== 🌍 Static Website ==================
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

// ================== Routes ==================
app.use("/health", require("./routes/health.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/shop", require("./routes/shop.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/leaderboard", require("./routes/leaderboard.routes"));
app.use("/api/voice", require("./routes/voice.routes"));

// ================== Website Fallback ==================
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// ================== Socket Handlers ==================
require("./sockets")(io);

// ================== Server Start ==================
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Game Server running on port ${PORT}`);
  logger.info(`🚀 Game Server running on port ${PORT}`);
});

// ================== Global Errors ==================
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  logger.error("Unhandled Rejection", err);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  logger.error("Uncaught Exception", err);
});