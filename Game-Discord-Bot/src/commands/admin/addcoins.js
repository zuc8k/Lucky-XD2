const { SlashCommandBuilder } = require("discord.js");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addcoins")
    .setDescription("Add coins to a game user")
    .addStringOption(opt =>
      opt.setName("uid")
        .setDescription("User UID")
        .setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName("amount")
        .setDescription("Coins amount")
        .setRequired(true)
    ),

  async execute(interaction) {
    const uid = interaction.options.getString("uid");
    const amount = interaction.options.getInteger("amount");

    if (amount <= 0) {
      return interaction.reply({
        content: "❌ Amount must be greater than 0",
        ephemeral: true
      });
    }

    const user = await User.findOne({ uid });
    if (!user) {
      return interaction.reply({
        content: "❌ User not found",
        ephemeral: true
      });
    }

    user.coins += amount;
    await user.save();

    await interaction.reply({
      content:
`✅ **Coins Added Successfully**
👤 User: ${user.username}
🆔 UID: ${user.uid}
➕ Added: ${amount}
💰 New Balance: ${user.coins}`
    });
  }
};