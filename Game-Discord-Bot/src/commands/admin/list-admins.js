const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");
const { requireRole } = require("../../middlewares/adminAuth");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list-admins")
    .setDescription("List all admins and their roles"),

  async execute(interaction) {
    // 🔐 Owner فقط
    const allowed = await requireRole(["OWNER"])(interaction);
    if (!allowed) return;

    const admins = await User.find({
      adminRole: { $ne: null }
    }).select("username discordId adminRole");

    if (!admins.length) {
      return interaction.reply({
        content: "❌ No admins found.",
        ephemeral: true
      });
    }

    const roleIcon = {
      OWNER: "👑",
      GAME_MASTER: "🎮",
      SUPPORT: "🛠️"
    };

    const lines = admins.map(a => {
      return `${roleIcon[a.adminRole] || "👤"} **${a.username}** — ${a.adminRole}`;
    });

    const embed = new EmbedBuilder()
      .setTitle("🛡️ Admins List")
      .setColor(0x9C27B0)
      .setDescription(lines.join("\n"))
      .setFooter({ text: "Admin Management" })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};