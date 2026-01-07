const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  reporterUid: { type: String, required: true }, // اللي عمل البلاغ
  targetUid: { type: String, required: true },   // اللي عليه البلاغ
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ["OPEN", "RESOLVED", "REJECTED"],
    default: "OPEN"
  },
  handledBy: { type: String }, // admin uid
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Report", ReportSchema);