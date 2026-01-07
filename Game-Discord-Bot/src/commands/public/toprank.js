const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("toprank")
    .setDescription("Show top ranked players")
    .addIntegerOption(opt =>
      opt.setName("limit")
        .setDescription("Number of top players (default 10, max 25)")
        .setRequired(false)
    ),

  async execute(interaction) {
    const limitRaw = interaction.options.getInteger("limit") || 10;
    const limit = Math.min(Math.max(limitRaw, 1), 25);

    const users = await User.find({ banned: { $ne: true } })
      .sort({ rankPoints: -1 })
      .limit(limit)
      .select("username rank rankPoints rankBadge wins loses");

    if (!users.length) {
      return interaction.reply({
        content: "❌ No ranked players found",
        ephemeral: true
      });
    }

    const lines = users.map((u, i) => {
      const wins = u.wins || 0;
      const loses = u.loses || 0;
      const total = wins + loses;
      const winRate =
        total > 0 ? ((wins / total) * 100).toFixed(1) : "0.0";

      return (
        `**#${i + 1} ${u.rankBadge || "🥉"} ${u.username}**\n` +
        `🏆 ${u.rank || "Bronze"} | ⭐ ${u.rankPoints || 0} RP\n` +
        `🎮 ${wins}W / ${loses}L (${winRate}%)`
      );
    });

    const embed = new EmbedBuilder()
      .setTitle("🏆 Top Ranked Players")
      .setColor(0xFFD54F)
      .setDescription(lines.join("\n\n"))
      .setFooter({ text: "Global Leaderboard" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};