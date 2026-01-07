const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Show public profile of a player")
    .addStringOption(opt =>
      opt.setName("username")
        .setDescription("Player username")
        .setRequired(true)
    ),

  async execute(interaction) {
    const username = interaction.options.getString("username");

    const user = await User.findOne({
      username: new RegExp(`^${username}$`, "i")
    });

    if (!user) {
      return interaction.reply({
        content: "❌ Player not found",
        ephemeral: true
      });
    }

    const wins = user.wins || 0;
    const loses = user.loses || 0;
    const total = wins + loses;
    const winRate =
      total > 0 ? ((wins / total) * 100).toFixed(2) : "0.00";

    const rankPosition =
      (await User.countDocuments({
        rankPoints: { $gt: user.rankPoints || 0 }
      })) + 1;

    const embed = new EmbedBuilder()
      .setTitle("👤 Player Profile")
      .setColor(0x2196F3)
      .addFields(
        { name: "Username", value: user.username, inline: true },
        { name: "UID", value: user.uid, inline: true },

        {
          name: "Rank",
          value: `${user.rankBadge || "🥉"} ${user.rank || "Bronze"}`,
          inline: true
        },
        {
          name: "Rank Points",
          value: `${user.rankPoints || 0}`,
          inline: true
        },

        { name: "Wins", value: `${wins}`, inline: true },
        { name: "Loses", value: `${loses}`, inline: true },
        { name: "Win Rate", value: `${winRate}%`, inline: true },

        {
          name: "Leaderboard Position",
          value: `#${rankPosition}`,
          inline: true
        }
      )
      .setFooter({ text: "Public Player Profile" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};