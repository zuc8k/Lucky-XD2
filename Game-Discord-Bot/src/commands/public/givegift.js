const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");
const Gift = require("../../models/Gift");
const GiftLog = require("../../models/GiftLog");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("givegift")
    .setDescription("Send a gift to another player")
    .addStringOption(opt =>
      opt.setName("to")
        .setDescription("Receiver username")
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("gift")
        .setDescription("Gift name")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const senderDiscordId = interaction.user.id;
    const toUsername = interaction.options.getString("to");
    const giftName = interaction.options.getString("gift");

    const sender = await User.findOne({ discordId: senderDiscordId });
    if (!sender) {
      return interaction.editReply("❌ You must link your game account first.");
    }

    const receiver = await User.findOne({ username: toUsername });
    if (!receiver) {
      return interaction.editReply("❌ Receiver not found.");
    }

    const gift = await Gift.findOne({
      name: new RegExp(`^${giftName}$`, "i")
    });

    if (!gift) {
      return interaction.editReply("❌ Gift not found.");
    }

    if (sender.coins < gift.price) {
      return interaction.editReply("❌ Not enough coins.");
    }

    // خصم الكوينز
    sender.coins -= gift.price;
    await sender.save();

    // تسجيل العملية
    await GiftLog.create({
      fromUser: sender.uid,
      toUser: receiver.uid,
      giftName: gift.name,
      price: gift.price
    });

    // (اختياري) تبعت Socket Event للعبة
    // io.to(receiver.socketId).emit("gift_received", {...});

    const embed = new EmbedBuilder()
      .setTitle("🎁 Gift Sent!")
      .setColor(0xE91E63)
      .setDescription(
        `**${sender.username}** sent **${gift.name}** to **${receiver.username}**`
      )
      .addFields(
        { name: "Cost", value: `${gift.price} Coins`, inline: true },
        { name: "Your Balance", value: `${sender.coins}`, inline: true }
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};