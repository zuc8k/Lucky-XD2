const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Report = require("../../models/Report");
const User = require("../../models/User");
const { requireRole } = require("../../middlewares/adminAuth");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reports")
    .setDescription("View player reports")
    .addStringOption(opt =>
      opt.setName("status")
        .setDescription("Filter by status")
        .addChoices(
          { name: "Open", value: "OPEN" },
          { name: "Resolved", value: "RESOLVED" },
          { name: "Rejected", value: "REJECTED" }
        )
        .setRequired(false)
    ),

  async execute(interaction) {
    const allowed = await requireRole(
      ["SUPPORT", "GAME_MASTER", "OWNER"]
    )(interaction);
    if (!allowed) return;

    const status = interaction.options.getString("status") || "OPEN";

    const reports = await Report.find({ status })
      .sort({ createdAt: -1 })
      .limit(10);

    if (!reports.length) {
      return interaction.reply({
        content: "❌ No reports found.",
        ephemeral: true
      });
    }

    const lines = await Promise.all(
      reports.map(async (r, i) => {
        const target = await User.findOne({ uid: r.targetUid });
        return (
          `**#${i + 1}**\n` +
          `👤 Target: ${target?.username || r.targetUid}\n` +
          `📝 Reason: ${r.reason}\n` +
          `🕒 <t:${Math.floor(r.createdAt.getTime() / 1000)}:R>\n` +
          `📌 Status: ${r.status}`
        );
      })
    );

    const embed = new EmbedBuilder()
      .setTitle("🚨 Player Reports")
      .setColor(0xF44336)
      .setDescription(lines.join("\n\n────────────\n\n"))
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};