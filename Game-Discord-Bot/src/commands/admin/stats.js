const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");
const Payment = require("../../models/Payment");
const GameLog = require("../../models/GameLog");
const HWIDBan = require("../../models/HWIDBan");
const IPBan = require("../../models/IPBan");

// لو عندك Redis ومخزّن online count
let redis;
try {
  redis = require("../../config/redis");
} catch (e) {
  redis = null;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Show global game statistics"),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const [
      totalUsers,
      totalGames,
      totalPayments,
      totalCoins,
      bannedAccounts,
      hwidBans,
      ipBans
    ] = await Promise.all([
      User.countDocuments(),
      GameLog.countDocuments(),
      Payment.countDocuments(),
      Payment.aggregate([
        { $group: { _id: null, coins: { $sum: "$coins" } } }
      ]),
      User.countDocuments({ banned: true }),
      HWIDBan.countDocuments(),
      IPBan.countDocuments()
    ]);

    let online = "N/A";
    if (redis) {
      try {
        const val = await redis.get("online:count");
        if (val) online = val;
      } catch {}
    }

    const embed = new EmbedBuilder()
      .setTitle("📊 Game Statistics")
      .setColor(0x00B0FF)
      .addFields(
        { name: "👥 Total Players", value: `${totalUsers}`, inline: true },
        { name: "🎮 Total Matches", value: `${totalGames}`, inline: true },
        { name: "💳 Total Payments", value: `${totalPayments}`, inline: true },
        {
          name: "💰 Coins Purchased",
          value: `${totalCoins[0]?.coins || 0}`,
          inline: true
        },
        { name: "🚫 Banned Accounts", value: `${bannedAccounts}`, inline: true },
        {
          name: "🖥️ HWID / IP Bans",
          value: `${hwidBans} / ${ipBans}`,
          inline: true
        },
        { name: "🟢 Online Now", value: `${online}`, inline: true }
      )
      .setFooter({ text: "Game Admin Bot" })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};