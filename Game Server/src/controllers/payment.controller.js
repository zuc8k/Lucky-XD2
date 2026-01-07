const User = require("../models/User");
const Payment = require("../models/Payment");
const Transaction = require("../models/Transaction");
const PRICES = require("../config/prices");

exports.verifyPayment = async (req, res) => {
  const { productId, transactionId, provider } = req.body;
  const userId = req.user.id;

  const pack = PRICES.PACKS[productId];
  if (!pack) return res.status(400).json({ msg: "Invalid product" });

  // ⚠️ هنا مكان التحقق الحقيقي من Google / Apple
  const isValid = true; // MVP

  if (!isValid)
    return res.status(400).json({ msg: "Payment invalid" });

  const user = await User.findById(userId);
  user.coins += pack.coins;
  await user.save();

  await Payment.create({
    userId,
    provider,
    productId,
    transactionId,
    amount: pack.price,
    coins: pack.coins,
    status: "success"
  });

  await Transaction.create({
    userId,
    type: "purchase",
    amount: pack.coins,
    balanceAfter: user.coins
  });

  res.json({
    success: true,
    coins: user.coins
  });
};