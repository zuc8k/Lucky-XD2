const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");

router.get(
  "/admins",
  auth,
  requireRole(["OWNER"]),
  async (req, res) => {
    res.json({ msg: "Admins list" });
  }
);

module.exports = router;