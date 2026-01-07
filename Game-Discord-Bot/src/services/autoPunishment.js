const WarnLog = require("../models/WarnLog");
const User = require("../models/User");
const AdminLog = require("../models/AdminLog");
const RULES = require("../config/punishments");

async function checkAutoPunishment(user, admin) {
  const warnsCount = await WarnLog.countDocuments({
    userId: user.uid
  });

  const rule = RULES.find(r => r.warns === warnsCount);
  if (!rule) return;

  // 🔇 Auto Mute
  if (rule.action === "MUTE") {
    const expiresAt = new Date(
      Date.now() + rule.minutes * 60 * 1000
    );

    user.mutedUntil = expiresAt;
    await user.save();

    await AdminLog.create({
      action: "AUTO_MUTE",
      targetUid: user.uid,
      adminUid: "SYSTEM",
      adminRole: "SYSTEM",
      details: `Auto mute for ${rule.minutes} minutes after ${warnsCount} warnings`
    });
  }

  // 🚫 Auto Ban (اختياري)
  if (rule.action === "BAN") {
    user.banned = true;
    await user.save();

    await AdminLog.create({
      action: "AUTO_BAN",
      targetUid: user.uid,
      adminUid: "SYSTEM",
      adminRole: "SYSTEM",
      details: `Auto ban after ${warnsCount} warnings`
    });
  }
}

module.exports = {
  checkAutoPunishment
};