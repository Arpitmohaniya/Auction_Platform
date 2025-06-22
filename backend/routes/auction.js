const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

// Protected GET route for auctions
router.get("/", auth, (req, res) => {
  res.json({
    message: "🎯 You have access to protected auctions data",
    userId: req.user,
  });
});

module.exports = router;
