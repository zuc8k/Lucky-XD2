const { SlashCommandBuilder } = require("discord.js");
const User = require("../../models/User");
const { requireRole } = require("../../middlewares/adminAuth");
const { logAdminAction } = require("../../utils/adminLogger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Unmute a player")
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
    const admin = await User.findOne({ discordId: interaction.user.id });

    if (!user) {
      return interaction.reply({
        content: "❌ User not linked to game account.",
        ephemeral: true
      });
    }

    // مش ميوت أصلاً
    if (!user.mutedUntil || new Date() > user.mutedUntil) {
      return interaction.reply({
        content: "ℹ️ This user is not muted.",
        ephemeral: true
      });
    }

    // فك الميوت
    user.mutedUntil = null;
    await user.save();

    // تسجيل لوج
    await logAdminAction({
      action: "UNMUTE",
      targetUid: user.uid,
      admin,
      details: "Manual unmute by admin"
    });

    await interaction.reply({
      content: `🔊 **${user.username} has been unmuted successfully.**`,
      ephemeral: true
    });

    // إشعار اللاعب (اختياري)
    try {
      await interaction.client.users.fetch(target.id)
        .then(u => u.send("🔊 You have been unmuted by an admin."));
    } catch (_) {}
  }
};