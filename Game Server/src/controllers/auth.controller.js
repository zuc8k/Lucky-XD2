const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const genUID = require("../utils/uid");

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const { username, password, phone, email, favorite, hwid } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: "Username and password are required" });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(409).json({ msg: "Username already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      uid: genUID(),
      username,
      password: hash,
      phone: phone || null,
      email: email || null,
      favorite: favorite || null,
      hwid: hwid || null,
      role: "USER",
      lastLogin: null
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ msg: "Register error" });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.banned)
      return res.status(403).json({ msg: "Account is banned" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ msg: "Wrong password" });

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        uid: user.uid,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Login error" });
  }
};