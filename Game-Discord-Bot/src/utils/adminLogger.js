const AdminLog = require("../models/AdminLog");

async function logAdminAction({
  action,
  targetUid,
  admin,
  details
}) {
  try {
    await AdminLog.create({
      action,
      targetUid,
      adminUid: admin.uid,
      adminRole: admin.adminRole,
      details
    });
  } catch (e) {
    console.error("AdminLog error:", e);
  }
}

module.exports = {
  logAdminAction
};