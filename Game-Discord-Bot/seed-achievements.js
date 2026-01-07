const mongoose = require("mongoose");
const Achievement = require("./src/models/Achievement");

mongoose.connect("mongodb://127.0.0.1:27017/yalla_game");

(async () => {
  await Achievement.insertMany([
    {
      key: "first_win",
      name: "First Victory",
      description: "Win your first match",
      icon: "🥇",
      rewardCoins: 300
    },
    {
      key: "daily_7",
      name: "Daily Master",
      description: "7 days daily streak",
      icon: "🔥",
      rewardCoins: 500
    },
    {
      key: "rank_gold",
      name: "Gold Player",
      description: "Reach Gold rank",
      icon: "🏆",
      rewardCoins: 700
    }
  ]);

  console.log("Achievements seeded");
  process.exit();
})();