const { SlashCommandBuilder } = require("discord.js");
const User = require("../../models/User");
const { requireRole } = require("../../middlewares/adminAuth");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove-admin")
    .setDescription("Remove admin role from a user")
    .addUserOption(opt =>
      opt.setName("user")
        .setDescription("Discord user")
        .setRequired(true)
    ),

  async execute(interaction) {
    const allowed = await requireRole(["OWNER"])(interaction);
    if (!allowed) return;

    const target = interaction.options.getUser("user");
    const user = await User.findOne({ discordId: target.id });

    if (!user || !user.adminRole) {
      return interaction.reply({
        content: "❌ User is not an admin.",
        ephemeral: true
      });
    }

    user.adminRole = null;
    await user.save();

    await interaction.reply({
      content: `🗑️ Admin role removed from ${target.username}`,
      ephemeral: true
    });
  }
};