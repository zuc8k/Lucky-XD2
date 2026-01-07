const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");

router.get("/stats", auth, async (req, res) => {
  res.json({
    online: await redis.get("online:count"),
    users: await User.countDocuments(),
    reports: await Report.countDocuments({ status: "OPEN" })
  });
});

module.exports = router;