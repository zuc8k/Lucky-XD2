const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Show detailed information about a game user")
    .addStringOption(opt =>
      opt.setName("uid")
        .setDescription("User UID")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const uid = interaction.options.getString("uid");

    const user = await User.findOne({ uid });
    if (!user) {
      return interaction.editReply({
        content: "❌ User not found"
      });
    }

    const wins = user.wins || 0;
    const loses = user.loses || 0;
    const totalGames = wins + loses;
    const winRate =
      totalGames > 0
        ? ((wins / totalGames) * 100).toFixed(2)
        : "0.00";

    const embed = new EmbedBuilder()
      .setTitle("👤 User Information")
      .setColor(0x7C4DFF)
      .addFields(
        { name: "Username", value: user.username || "N/A", inline: true },
        { name: "UID", value: user.uid, inline: true },
        { name: "Coins", value: `${user.coins || 0}`, inline: true },

        { name: "Rank", value: user.rank || "Unranked", inline: true },
        { name: "Rank Points", value: `${user.rankPoints || 0}`, inline: true },

        { name: "Wins", value: `${wins}`, inline: true },
        { name: "Loses", value: `${loses}`, inline: true },
        { name: "Win Rate", value: `${winRate}%`, inline: true },

        {
          name: "Banned",
          value: user.banned ? "🚫 Yes" : "✅ No",
          inline: true
        },

        { name: "HWID", value: user.hwid || "N/A", inline: false },
        { name: "Last IP", value: user.lastIp || "N/A", inline: true },
        {
          name: "Last Login",
          value: user.lastLogin
            ? `<t:${Math.floor(new Date(user.lastLogin).getTime() / 1000)}:R>`
            : "N/A",
          inline: true
        }
      )
      .setFooter({ text: "Game Admin Bot – User Info" })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};