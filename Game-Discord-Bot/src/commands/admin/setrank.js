const { SlashCommandBuilder } = require("discord.js");
const User = require("../../models/User");

// نفس منطق الرانكات بتاع السيرفر
function getRankPoints(rank) {
  switch (rank) {
    case "Bronze": return 0;
    case "Silver": return 600;
    case "Gold": return 1200;
    case "Diamond": return 2000;
    default: return null;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setrank")
    .setDescription("Set rank for a game user")
    .addStringOption(opt =>
      opt.setName("uid")
        .setDescription("User UID")
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("rank")
        .setDescription("Rank name")
        .setRequired(true)
        .addChoices(
          { name: "Bronze", value: "Bronze" },
          { name: "Silver", value: "Silver" },
          { name: "Gold", value: "Gold" },
          { name: "Diamond", value: "Diamond" }
        )
    ),

  async execute(interaction) {
    const uid = interaction.options.getString("uid");
    const rank = interaction.options.getString("rank");

    const points = getRankPoints(rank);
    if (points === null) {
      return interaction.reply({
        content: "❌ Invalid rank",
        ephemeral: true
      });
    }

    const user = await User.findOne({ uid });
    if (!user) {
      return interaction.reply({
        content: "❌ User not found",
        ephemeral: true
      });
    }

    user.rank = rank;
    user.rankPoints = points;
    await user.save();

    await interaction.reply({
      content:
`✅ **Rank Updated Successfully**
👤 User: ${user.username}
🆔 UID: ${user.uid}
🏆 New Rank: ${rank}
⭐ Rank Points: ${points}`
    });
  }
};