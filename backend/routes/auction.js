// routes/auction.js
const express = require("express");
const router = express.Router();
const Auction = require("../models/Auction");
const upload = require("../middleware/upload");
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

// Create new auction
router.post("/", auth, upload.single("image"), async (req, res) => {
  const { title, description, startingBid } = req.body;

  console.log("REQ BODY:", req.body);     // ✅ check this in your server log!
  console.log("REQ FILE:", req.file);     // ✅ check file

  const auction = new Auction({
    title,
    description,
    startingBid: Number(startingBid),   // ✅ make sure it’s a Number!
    imageUrl: req.file ? req.file.path : "",
    createdBy: req.user.id,
  });

  await auction.save();
  res.status(201).json({ success: true, auction });
});



// ✅ Fetch all auctions
router.get("/", async (req, res) => {
  try {
    const auctions = await Auction.find().populate("createdBy", "name");
    res.json({ success: true, auctions });
  } catch (err) {
    console.error("❌ Error fetching auctions:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🗑️ Delete auction by ID (Admin only)

router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    await auction.deleteOne(); // ✅ use deleteOne() instead of remove()

    res.json({ message: "Auction removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;

