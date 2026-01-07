const router = require("express").Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");

// Login باستخدام Game Server
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // نكلم Game Server Auth API
    const response = await axios.post(
      process.env.GAME_SERVER_URL + "/api/auth/login",
      { username, password }
    );

    const { token } = response.data;

    // نتحقق من التوكن ونطلّع الداتا
    const payload = jwt.verify(token, process.env.GAME_JWT_SECRET);

    // نطلع Dashboard Token خاص
    const dashboardToken = jwt.sign(
      {
        uid: payload.uid,
        role: payload.role
      },
      process.env.DASHBOARD_JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token: dashboardToken
    });
  } catch (err) {
    res.status(401).json({
      msg: "Invalid credentials"
    });
  }
});

module.exports = router;