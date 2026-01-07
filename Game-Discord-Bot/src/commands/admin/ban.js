const { SlashCommandBuilder } = require("discord.js");
const User = require("../../models/User");
const HWIDBan = require("../../models/HWIDBan");
const IPBan = require("../../models/IPBan");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user / HWID / IP")
    .addStringOption(opt =>
      opt.setName("type")
        .setDescription("Ban type")
        .setRequired(true)
        .addChoices(
          { name: "Account", value: "account" },
          { name: "HWID", value: "hwid" },
          { name: "IP", value: "ip" }
        )
    )
    .addStringOption(opt =>
      opt.setName("value")
        .setDescription("UID / HWID / IP")
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("reason")
        .setDescription("Reason for ban")
        .setRequired(false)
    ),

  async execute(interaction) {
    const type = interaction.options.getString("type");
    const value = interaction.options.getString("value");
    const reason =
      interaction.options.getString("reason") || "No reason";

    // 🚫 Account Ban
    if (type === "account") {
      const user = await User.findOne({ uid: value });
      if (!user) {
        return interaction.reply({
          content: "❌ User not found",
          ephemeral: true
        });
      }

      user.banned = true;
      await user.save();

      return interaction.reply({
        content:
`🚫 **Account Banned**
👤 User: ${user.username}
🆔 UID: ${user.uid}
📄 Reason: ${reason}`
      });
    }

    // 🚫 HWID Ban
    if (type === "hwid") {
      await HWIDBan.create({
        hwid: value,
        reason
      });

      return interaction.reply({
        content:
`🚫 **HWID Banned**
🖥️ HWID: ${value}
📄 Reason: ${reason}`
      });
    }

    // 🚫 IP Ban
    if (type === "ip") {
      await IPBan.create({
        ip: value,
        reason
      });

      return interaction.reply({
        content:
`🚫 **IP Banned**
🌐 IP: ${value}
📄 Reason: ${reason}`
      });
    }
  }
};