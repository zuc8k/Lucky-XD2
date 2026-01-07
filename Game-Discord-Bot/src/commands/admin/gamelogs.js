const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const GameLog = require("../../models/GameLog");
const User = require("../../models/User");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gamelogs")
    .setDescription("Show game match logs")
    .addStringOption(opt =>
      opt.setName("uid")
        .setDescription("Filter by User UID (optional)")
        .setRequired(false)
    )
    .addIntegerOption(opt =>
      opt.setName("limit")
        .setDescription("Number of matches to show (default 10)")
        .setRequired(false)
    ),

  async execute(interaction) {
    const uid = interaction.options.getString("uid");
    const limit = interaction.options.getInteger("limit") || 10;

    let query = {};
    let title = "🎮 Game Logs";

    if (uid) {
      const user = await User.findOne({ uid });
      if (!user) {
        return interaction.reply({
          content: "❌ User not found",
          ephemeral: true
        });
      }
      // الماتشات اللي اللاعب كان فيها
      query.players = user.uid;
      title += ` – ${user.username}`;
    }

    const games = await GameLog.find(query)
      .sort({ endedAt: -1 })
      .limit(limit);

    if (!games.length) {
      return interaction.reply({
        content: "❌ No game logs found",
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setColor(0x2979FF)
      .setDescription(
        games.map((g, i) =>
          `**${i + 1}. Room:** ${g.roomId}
🏆 Winner: ${g.winner}
👥 Players: ${g.players.join(", ")}
🔢 Moves: ${g.totalMoves}
⏱️ Duration: ${
  Math.floor((new Date(g.endedAt) - new Date(g.startedAt)) / 1000)
}s
📅 Ended: <t:${Math.floor(new Date(g.endedAt).getTime()/1000)}:R>`
        ).join("\n\n")
      )
      .setFooter({ text: "Game Match History" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};