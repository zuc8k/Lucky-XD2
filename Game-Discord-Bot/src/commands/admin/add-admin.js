const { SlashCommandBuilder } = require("discord.js");
const User = require("../../models/User");
const { requireRole } = require("../../middlewares/adminAuth");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-admin")
    .setDescription("Add admin role to a user")
    .addUserOption(opt =>
      opt.setName("user")
        .setDescription("Discord user")
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("role")
        .setDescription("Admin role")
        .setRequired(true)
        .addChoices(
          { name: "Owner", value: "OWNER" },
          { name: "Game Master", value: "GAME_MASTER" },
          { name: "Support", value: "SUPPORT" }
        )
    ),

  async execute(interaction) {
    // 🔐 Owner فقط
    const allowed = await requireRole(["OWNER"])(interaction);
    if (!allowed) return;

    const target = interaction.options.getUser("user");
    const role = interaction.options.getString("role");

    const user = await User.findOne({ discordId: target.id });
    if (!user) {
      return interaction.reply({
        content: "❌ This user is not linked to a game account.",
        ephemeral: true
      });
    }

    user.adminRole = role;
    await user.save();

    await interaction.reply({
      content: `✅ ${target.username} is now **${role}**`,
      ephemeral: true
    });
  }
};