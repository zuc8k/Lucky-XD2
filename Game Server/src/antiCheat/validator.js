const CheatLog = require("../models/CheatLog");

exports.invalidMove = async ({
  userId,
  action,
  reason,
  roomId
}) => {
  await CheatLog.create({
    userId,
    action,
    reason,
    roomId
  });

  console.log("🚨 CHEAT DETECTED:", reason);
};