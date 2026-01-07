const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const AdminLog = require("../../models/AdminLog");
const { requireRole } = require("../../middlewares/adminAuth");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("admin-logs")
    .setDescription("View admin actions logs")
    .addStringOption(opt =>
      opt.setName("action")
        .setDescription("Filter by action (optional)")
        .setRequired(false)
    ),

  async execute(interaction) {
    const allowed = await requireRole(["GAME_MASTER", "OWNER"])(interaction);
    if (!allowed) return;

    const action = interaction.options.getString("action");

    const query = action ? { action } : {};

    const logs = await AdminLog.find(query)
      .sort({ createdAt: -1 })
      .limit(10);

    if (!logs.length) {
      return interaction.reply({
        content: "❌ No logs found.",
        ephemeral: true
      });
    }

    const lines = logs.map(l => {
      return (
        `🕒 <t:${Math.floor(l.createdAt.getTime() / 1000)}:R>\n` +
        `🔧 **${l.action}**\n` +
        `👤 Target UID: ${l.targetUid || "N/A"}\n` +
        `🛡️ Admin UID: ${l.adminUid} (${l.adminRole})\n` +
        `📝 ${l.details || "-"}`
      );
    });

    const embed = new EmbedBuilder()
      .setTitle("🧾 Admin Logs (Last 10)")
      .setColor(0x607D8B)
      .setDescription(lines.join("\n\n────────────\n\n"))
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};