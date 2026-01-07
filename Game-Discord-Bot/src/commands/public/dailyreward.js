const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const User = require("../../models/User");

const BASE_REWARD = 200;
const COOLDOWN_HOURS = 24;

// Bonus حسب الستريك
function getBonus(streak) {
  if (streak >= 14) return 800;
  if (streak >= 7) return 400;
  if (streak >= 5) return 200;
  if (streak >= 3) return 100;
  return 0;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dailyreward")
    .setDescription("Claim your daily reward with streak bonus"),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const discordId = interaction.user.id;
    const user = await User.findOne({ discordId });

    if (!user) {
      return interaction.editReply(
        "❌ You must link your game account first."
      );
    }

    const now = new Date();
    const last = user.lastDailyAt ? new Date(user.lastDailyAt) : null;

    // منع التكرار
    if (last) {
      const diffHours = (now - last) / (1000 * 60 * 60);
      if (diffHours < COOLDOWN_HOURS) {
        const next = new Date(
          last.getTime() + COOLDOWN_HOURS * 60 * 60 * 1000
        );
        return interaction.editReply(
          `⏳ You already claimed your reward.\n` +
          `Come back <t:${Math.floor(next.getTime() / 1000)}:R>`
        );
      }
    }

    // حساب الستريك
    let streak = user.dailyStreak || 0;

    if (last) {
      const diffDays = Math.floor(
        (now - last) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        streak += 1; // متتالي
      } else {
        streak = 1; // اتكسر
      }
    } else {
      streak = 1;
    }

    const bonus = getBonus(streak);
    const totalReward = BASE_REWARD + bonus;

    // تحديث البيانات
    user.dailyStreak = streak;
    user.maxDailyStreak = Math.max(
      user.maxDailyStreak || 0,
      streak
    );
    user.lastDailyAt = now;
    user.coins = (user.coins || 0) + totalReward;

    await user.save();

    const embed = new EmbedBuilder()
      .setTitle("🎁 Daily Reward Claimed!")
      .setColor(0x66BB6A)
      .addFields(
        { name: "Base Reward", value: `${BASE_REWARD} Coins`, inline: true },
        { name: "Streak Bonus", value: `${bonus} Coins`, inline: true },
        { name: "Total", value: `${totalReward} Coins`, inline: true },
        { name: "🔥 Current Streak", value: `${streak} days`, inline: true },
        {
          name: "🏆 Best Streak",
          value: `${user.maxDailyStreak} days`,
          inline: true
        },
        {
          name: "💰 New Balance",
          value: `${user.coins} Coins`,
          inline: true
        }
      )
      .setFooter({ text: "Come back tomorrow to increase your streak!" })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};