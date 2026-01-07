const HWIDBan = require("../models/HWIDBan");

module.exports = async (req, res, next) => {
  const { hwid } = req.body;
  if (!hwid) return next();

  const banned = await HWIDBan.findOne({ hwid });
  if (banned)
    return res
      .status(403)
      .json({ msg: "Device banned" });

  next();
};