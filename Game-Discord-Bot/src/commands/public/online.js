const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

// Redis (اختياري – fallback لو مش موجود)
let redis;
try {
  redis = require("../../config/redis");
} catch (e) {
  redis = null;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("online")
    .setDescription("Show online players and active rooms"),

  async execute(interaction) {
    let onlinePlayers = "N/A";
    let activeRooms = "N/A";

    if (redis) {
      try {
        onlinePlayers = (await redis.get("online:count")) || 0;
        activeRooms = (await redis.get("rooms:count")) || 0;
      } catch {
        // ignore
      }
    }

    const embed = new EmbedBuilder()
      .setTitle("🟢 Online Status")
      .setColor(0x4CAF50)
      .addFields(
        { name: "Players Online", value: `${onlinePlayers}`, inline: true },
        { name: "Active Rooms", value: `${activeRooms}`, inline: true },
        {
          name: "Last Update",
          value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
          inline: false
        }
      )
      .setFooter({ text: "Live game status" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};