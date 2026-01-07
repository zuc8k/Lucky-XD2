const User = require("../models/User");

function requireRole(roles = []) {
  return async (interaction) => {
    const user = await User.findOne({
      discordId: interaction.user.id
    });

    if (!user || !roles.includes(user.adminRole)) {
      await interaction.reply({
        content: "❌ You do not have permission to use this command.",
        ephemeral: true
      });
      return false;
    }

    return true;
  };
}

module.exports = {
  requireRole
};