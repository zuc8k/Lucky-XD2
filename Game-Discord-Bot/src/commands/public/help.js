const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show available game commands"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("📘 Game Commands Help")
      .setColor(0x00BCD4)
      .addFields(
        {
          name: "👤 Profile",
          value:
            "`/profile` – Show your game profile\n" +
            "`/userinfo` – View another player's profile",
          inline: false
        },
        {
          name: "🏆 Rankings",
          value:
            "`/toprank` – Show top ranked players\n" +
            "`/stats` – Global game statistics",
          inline: false
        },
        {
          name: "🎉 Events",
          value:
            "`/events` – Current & upcoming events",
          inline: false
        },
        {
          name: "ℹ️ Info",
          value:
            "• Coins & RP are earned by playing matches\n" +
            "• Rankings update automatically\n" +
            "• Join events to earn extra rewards",
          inline: false
        }
      )
      .setFooter({ text: "Good luck & have fun 🎮" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};