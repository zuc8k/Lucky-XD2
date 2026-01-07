const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const CheatLog = require("../../models/CheatLog");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cheatlogs")
    .setDescription("Show anti-cheat logs")
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
    let title = "🚨 Cheat Logs";

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

    const logs = await CheatLog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    if (!logs.length) {
      return interaction.reply({
        content: "❌ No cheat logs found",
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setColor(0xD50000)
      .setDescription(
        logs.map((l, i) =>
          `**${i + 1}. ${l.action}**
🆔 Room: ${l.roomId}
📄 Reason: ${l.reason}
📅 Time: <t:${Math.floor(new Date(l.createdAt).getTime()/1000)}:R>`
        ).join("\n\n")
      )
      .setFooter({ text: "Anti-Cheat System" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};