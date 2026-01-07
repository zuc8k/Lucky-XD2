const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");
const WarnLog = require("../../models/WarnLog");
const { requireRole } = require("../../middlewares/adminAuth");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("View warnings of a player")
    .addUserOption(opt =>
      opt.setName("user")
        .setDescription("Discord user")
        .setRequired(true)
    ),

  async execute(interaction) {
    const allowed = await requireRole(
      ["SUPPORT", "GAME_MASTER", "OWNER"]
    )(interaction);
    if (!allowed) return;

    const target = interaction.options.getUser("user");

    const user = await User.findOne({ discordId: target.id });
    if (!user) {
      return interaction.reply({
        content: "❌ User not linked to game account.",
        ephemeral: true
      });
    }

    const warnings = await WarnLog.find({ userId: user.uid })
      .sort({ createdAt: -1 })
      .limit(10);

    if (!warnings.length) {
      return interaction.reply({
        content: `✅ ${user.username} has no warnings.`,
        ephemeral: true
      });
    }

    const lines = warnings.map((w, i) => {
      return (
        `**#${i + 1}**\n` +
        `📝 Reason: ${w.reason}\n` +
        `👮 By Admin UID: ${w.byAdmin}\n` +
        `🕒 <t:${Math.floor(new Date(w.createdAt).getTime() / 1000)}:R>`
      );
    });

    const embed = new EmbedBuilder()
      .setTitle(`⚠️ Warnings for ${user.username}`)
      .setColor(0xFF9800)
      .setDescription(lines.join("\n\n────────────\n\n"))
      .setFooter({ text: "Last 10 warnings" })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};