const { SlashCommandBuilder } = require("discord.js");
const User = require("../../models/User");
const HWIDBan = require("../../models/HWIDBan");
const IPBan = require("../../models/IPBan");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user / HWID / IP")
    .addStringOption(opt =>
      opt.setName("type")
        .setDescription("Unban type")
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
    ),

  async execute(interaction) {
    const type = interaction.options.getString("type");
    const value = interaction.options.getString("value");

    // ✅ Unban Account
    if (type === "account") {
      const user = await User.findOne({ uid: value });
      if (!user) {
        return interaction.reply({
          content: "❌ User not found",
          ephemeral: true
        });
      }

      user.banned = false;
      await user.save();

      return interaction.reply({
        content:
`✅ **Account Unbanned**
👤 User: ${user.username}
🆔 UID: ${user.uid}`
      });
    }

    // ✅ Unban HWID
    if (type === "hwid") {
      const result = await HWIDBan.deleteOne({ hwid: value });
      if (result.deletedCount === 0) {
        return interaction.reply({
          content: "❌ HWID not found",
          ephemeral: true
        });
      }

      return interaction.reply({
        content:
`✅ **HWID Unbanned**
🖥️ HWID: ${value}`
      });
    }

    // ✅ Unban IP
    if (type === "ip") {
      const result = await IPBan.deleteOne({ ip: value });
      if (result.deletedCount === 0) {
        return interaction.reply({
          content: "❌ IP not found",
          ephemeral: true
        });
      }

      return interaction.reply({
        content:
`✅ **IP Unbanned**
🌐 IP: ${value}`
      });
    }
  }
};