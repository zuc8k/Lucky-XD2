const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  /* ================== CORE ================== */
  uid: { type: String, unique: true },
  username: { type: String, required: true },

  /* ================== ECONOMY ================== */
  coins: { type: Number, default: 0 },

  /* ================== RANK SYSTEM ================== */
  rank: { type: String, default: "Bronze" },
  rankPoints: { type: Number, default: 0 },
  rankBadge: { type: String, default: "🥉" },

  /* ================== STATS ================== */
  wins: { type: Number, default: 0 },
  loses: { type: Number, default: 0 },

  /* ================== DAILY REWARD ================== */
  lastDailyAt: { type: Date },
  dailyStreak: { type: Number, default: 0 },
  maxDailyStreak: { type: Number, default: 0 },

  /* ================== ACHIEVEMENTS ================== */
  achievements: { type: [String], default: [] },

  /* ================== ADMIN ROLES ================== */
  adminRole: {
    type: String,
    enum: ["OWNER", "GAME_MASTER", "SUPPORT"],
    default: null
  },

  /* ================== MODERATION ================== */
  mutedUntil: { type: Date }, // 🔇 Game-level mute

  /* ================== SECURITY ================== */
  banned: { type: Boolean, default: false },
  hwid: { type: String },

  /* ================== DISCORD LINK ================== */
  discordId: { type: String },

  /* ================== META ================== */
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);