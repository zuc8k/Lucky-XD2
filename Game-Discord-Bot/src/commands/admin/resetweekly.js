const { SlashCommandBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resetweekly")
    .setDescription("Reset weekly leaderboard (rank points)"),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    // اختيار: تصفير RP بس، من غير تغيير الرانك
    const result = await User.updateMany(
      {},
      { $set: { rankPoints: 0 } }
    );

    await interaction.editReply({
      content:
`✅ **Weekly Leaderboard Reset Done**
👥 Users affected: ${result.modifiedCount}
📅 Time: ${new Date().toLocaleString()}`
    });
  }
};