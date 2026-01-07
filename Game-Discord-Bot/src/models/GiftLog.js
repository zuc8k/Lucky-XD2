const mongoose = require("mongoose");

const GiftLogSchema = new mongoose.Schema({
  fromUser: String,
  toUser: String,
  giftName: String,
  price: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("GiftLog", GiftLogSchema);