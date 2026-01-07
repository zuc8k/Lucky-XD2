const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Show top ranked players")
    .addIntegerOption(opt =>
      opt.setName("limit")
        .setDescription("Number of players to show (default 10)")
        .setRequired(false)
    ),

  async execute(interaction) {
    const limit = interaction.options.getInteger("limit") || 10;

    const top = await User.find()
      .sort({ rankPoints: -1 })
      .limit(limit)
      .select("username rank rankPoints wins");

    if (!top.length) {
      return interaction.reply({
        content: "❌ No players found",
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("🏆 Leaderboard – Top Players")
      .setColor(0xFFD700)
      .setDescription(
        top.map((u, i) =>
          `**${i + 1}. ${u.username}**\n` +
          `🏆 Rank: ${u.rank}\n` +
          `⭐ RP: ${u.rankPoints}\n` +
          `🎮 Wins: ${u.wins}\n`
        ).join("\n")
      )
      .setFooter({ text: "Game Leaderboard" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};