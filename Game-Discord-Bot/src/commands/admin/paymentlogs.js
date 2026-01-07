const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Payment = require("../../models/Payment");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("paymentlogs")
    .setDescription("Show payment logs")
    .addStringOption(opt =>
      opt.setName("uid")
        .setDescription("Filter by User UID (optional)")
        .setRequired(false)
    )
    .addIntegerOption(opt =>
      opt.setName("limit")
        .setDescription("Number of logs to show (default 10)")
        .setRequired(false)
    ),

  async execute(interaction) {
    const uid = interaction.options.getString("uid");
    const limit = interaction.options.getInteger("limit") || 10;

    let query = {};
    let title = "💰 Payment Logs";

    if (uid) {
      const user = await User.findOne({ uid });
      if (!user) {
        return interaction.reply({
          content: "❌ User not found",
          ephemeral: true
        });
      }
      query.userId = user._id;
      title += ` – ${user.username}`;
    }

    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    if (!payments.length) {
      return interaction.reply({
        content: "❌ No payment logs found",
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setColor(0x00C853)
      .setDescription(
        payments.map((p, i) =>
          `**${i + 1}. ${p.provider.toUpperCase()}**
🆔 Tx: ${p.transactionId}
📦 Product: ${p.productId}
💰 Coins: ${p.coins}
📅 Date: <t:${Math.floor(new Date(p.createdAt).getTime()/1000)}:R>
Status: ${p.status}`
        ).join("\n\n")
      )
      .setFooter({ text: "Game Payments" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};