const mongoose = require("mongoose");

const AdminLogSchema = new mongoose.Schema({
  action: { type: String, required: true },   // WARN / MUTE / ADD_ADMIN ...
  targetUid: { type: String },                 // uid اللاعب
  adminUid: { type: String, required: true },  // uid الأدمن
  adminRole: { type: String },                 // OWNER / GM / SUPPORT
  details: { type: String },                   // reason / extra info
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AdminLog", AdminLogSchema);