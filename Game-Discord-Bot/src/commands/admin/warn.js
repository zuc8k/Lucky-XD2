const { SlashCommandBuilder } = require("discord.js");
const User = require("../../models/User");
const WarnLog = require("../../models/WarnLog");
const { requireRole } = require("../../middlewares/adminAuth");
const { checkAutoPunishment } = require("../../services/autoPunishment");

// بعد إنشاء WarnLog
await checkAutoPunishment(user, admin);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a player")
    .addUserOption(opt =>
      opt.setName("user").setDescription("Discord user").setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("reason").setDescription("Reason").setRequired(true)
    ),

  async execute(interaction) {
    const allowed = await requireRole(["SUPPORT", "GAME_MASTER", "OWNER"])(interaction);
    if (!allowed) return;

    const target = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    const user = await User.findOne({ discordId: target.id });
    const admin = await User.findOne({ discordId: interaction.user.id });

    if (!user) {
      return interaction.reply({ content: "❌ User not linked.", ephemeral: true });
    }

    await WarnLog.create({
      userId: user.uid,
      byAdmin: admin.uid,
      reason
    });

    await interaction.reply({
      content: `⚠️ **Warn issued** to ${user.username}\nReason: ${reason}`,
      ephemeral: true
    });
  }
};