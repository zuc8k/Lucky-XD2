const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema({
  key: String,          // unique id
  name: String,         // display name
  description: String,  // شرح
  icon: String,         // emoji أو icon
  rewardCoins: Number   // مكافأة (اختياري)
});

module.exports = mongoose.model("Achievement", AchievementSchema);