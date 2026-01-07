const { SlashCommandBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("checkuser")
    .setDescription("Check game user by UID")
    .addStringOption(opt =>
      opt.setName("uid")
        .setDescription("User UID")
        .setRequired(true)
    ),

  async execute(interaction) {
    const uid = interaction.options.getString("uid");

    const user = await User.findOne({ uid });
    if (!user)
      return interaction.reply({
        content: "❌ User not found",
        ephemeral: true
      });

    interaction.reply({
      content:
`👤 **${user.username}**
🆔 UID: ${user.uid}
💰 Coins: ${user.coins}
🏆 Rank: ${user.rank}
⭐ Rank Points: ${user.rankPoints}
🎮 Wins: ${user.wins}
🚫 Banned: ${user.banned ? "Yes" : "No"}`
    });
  }
};