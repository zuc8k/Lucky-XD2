const { SlashCommandBuilder } = require("discord.js");
const User = require("../../models/User");
const Report = require("../../models/Report");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report")
    .setDescription("Report a player")
    .addUserOption(opt =>
      opt.setName("user")
        .setDescription("Player to report")
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("reason")
        .setDescription("Reason for report")
        .setRequired(true)
    ),

  async execute(interaction) {
    const reporterDiscordId = interaction.user.id;
    const target = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    const reporter = await User.findOne({ discordId: reporterDiscordId });
    const targetUser = await User.findOne({ discordId: target.id });

    if (!reporter || !targetUser) {
      return interaction.reply({
        content: "❌ Both users must be linked to game accounts.",
        ephemeral: true
      });
    }

    if (reporter.uid === targetUser.uid) {
      return interaction.reply({
        content: "❌ You cannot report yourself.",
        ephemeral: true
      });
    }

    await Report.create({
      reporterUid: reporter.uid,
      targetUid: targetUser.uid,
      reason
    });

    await interaction.reply({
      content: "✅ Report submitted successfully. Our team will review it.",
      ephemeral: true
    });
  }
};