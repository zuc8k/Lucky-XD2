const User = require("../models/User");
const Gift = require("../models/Gift");
const Transaction = require("../models/Transaction");

exports.getGifts = async (req, res) => {
  const gifts = await Gift.find();
  res.json(gifts);
};

exports.sendGift = async (req, res) => {
  const { giftId, targetUserId } = req.body;
  const userId = req.user.id;

  const user = await User.findById(userId);
  const target = await User.findById(targetUserId);
  const gift = await Gift.findById(giftId);

  if (!gift || user.coins < gift.price)
    return res.status(400).json({ msg: "Not enough coins" });

  user.coins -= gift.price;

  await Transaction.create({
    userId,
    type: "gift",
    amount: -gift.price,
    balanceAfter: user.coins
  });

  await user.save();

  res.json({ success: true });
};