const mongoose = require("mongoose");

const GiftSchema = new mongoose.Schema({
  name: String,
  price: Number, // coins
  image: String,
  animation: String
});

module.exports = mongoose.model("Gift", GiftSchema);