const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");
const Achievement = require("../../models/Achievement");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("achievements")
    .setDescription("Show your achievements"),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const user = await User.findOne({ discordId: interaction.user.id });
    if (!user) {
      return interaction.editReply("❌ Link your game account first.");
    }

    const all = await Achievement.find();
    const unlocked = user.achievements || [];

    const embed = new EmbedBuilder()
      .setTitle("🏆 Your Achievements")
      .setColor(0xFFD700)
      .setDescription(
        all.map(a => {
          const has = unlocked.includes(a.key);
          return (
            `${a.icon} **${a.name}**\n` +
            `${has ? "✅ Unlocked" : "🔒 Locked"}\n` +
            `${a.description}`
          );
        }).join("\n\n")
      )
      .setFooter({ text: "Keep playing to unlock more!" })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};