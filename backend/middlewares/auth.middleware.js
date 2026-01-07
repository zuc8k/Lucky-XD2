const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ msg: "Unauthorized" });

  try {
    req.admin = jwt.verify(
      token,
      process.env.DASHBOARD_JWT_SECRET
    );
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};