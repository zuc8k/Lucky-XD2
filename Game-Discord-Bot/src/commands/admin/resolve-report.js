const { SlashCommandBuilder } = require("discord.js");
const Report = require("../../models/Report");
const User = require("../../models/User");
const { requireRole } = require("../../middlewares/adminAuth");
const { logAdminAction } = require("../../utils/adminLogger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resolve-report")
    .setDescription("Resolve or reject a report")
    .addStringOption(opt =>
      opt.setName("report_id")
        .setDescription("Report ID")
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("action")
        .setDescription("Resolution")
        .setRequired(true)
        .addChoices(
          { name: "Resolve", value: "RESOLVED" },
          { name: "Reject", value: "REJECTED" }
        )
    ),

  async execute(interaction) {
    // 🔐 GM أو OWNER فقط
    const allowed = await requireRole(
      ["GAME_MASTER", "OWNER"]
    )(interaction);
    if (!allowed) return;

    const reportId = interaction.options.getString("report_id");
    const action = interaction.options.getString("action");

    const report = await Report.findById(reportId);
    if (!report) {
      return interaction.reply({
        content: "❌ Report not found.",
        ephemeral: true
      });
    }

    // لو متقفل قبل كده
    if (report.status !== "OPEN") {
      return interaction.reply({
        content: "ℹ️ This report is already handled.",
        ephemeral: true
      });
    }

    report.status = action;
    report.handledBy = interaction.user.id;
    await report.save();

    const admin = await User.findOne({
      discordId: interaction.user.id
    });

    // 🧾 Admin Log
    await logAdminAction({
      action: `REPORT_${action}`,
      targetUid: report.targetUid,
      admin,
      details: `Report ID: ${reportId}`
    });

    await interaction.reply({
      content: `✅ Report has been **${action}** successfully.`,
      ephemeral: true
    });
  }
};