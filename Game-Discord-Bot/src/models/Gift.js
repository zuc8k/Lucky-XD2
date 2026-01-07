const mongoose = require("mongoose");

const GiftSchema = new mongoose.Schema({
  name: String,
  price: Number,
  icon: String
});

module.exports = mongoose.model("Gift", GiftSchema);