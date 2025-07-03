const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// ✅ FIX: Require your auth middleware!
const auth = require("../middleware/authMiddleware");

console.log("✅ Auth routes file loaded");

router.post("/register", (req, res, next) => {
  console.log("📥 Register route hit");
  next();
}, register);

router.post("/login", (req, res, next) => {
  console.log("🔐 Login route hit");
  next();
}, login);

router.get("/me", auth, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
