const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Event = require("../../models/Event");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("events")
    .setDescription("Show current and upcoming game events"),

  async execute(interaction) {
    const events = await Event.find()
      .sort({ startAt: 1 })
      .limit(5);

    if (!events.length) {
      return interaction.reply({
        content: "❌ No events available right now",
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("🎉 Game Events")
      .setColor(0xFF6F00)
      .setDescription(
        events.map(ev => {
          const status = ev.active
            ? "🟢 Active"
            : new Date() < ev.startAt
              ? "🟡 Upcoming"
              : "🔴 Ended";

          return (
            `**${ev.name}**\n` +
            `${ev.description || "No description"}\n\n` +
            `📅 Start: <t:${Math.floor(new Date(ev.startAt).getTime()/1000)}:R>\n` +
            `📅 End: <t:${Math.floor(new Date(ev.endAt).getTime()/1000)}:R>\n` +
            `🎁 Reward: +${ev.rewardCoins || 0} Coins / +${ev.rewardRP || 0} RP\n` +
            `👥 Participants: ${ev.participants}\n` +
            `🎮 Matches: ${ev.matchesPlayed}\n` +
            `📌 Status: ${status}`
          );
        }).join("\n\n────────────\n\n")
      )
      .setFooter({ text: "Join events and earn rewards!" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};