// routes/auction.js
const express = require("express");
const router = express.Router();
const Auction = require("../models/Auction");
const upload = require("../middleware/upload");
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

// ✅ Create new auction
router.post("/", auth, upload.single("image"), async (req, res) => {
  const { title, description, startingBid } = req.body;

  console.log("REQ BODY:", req.body);
  console.log("REQ FILE:", req.file);

  const auction = new Auction({
    title,
    description,
    startingBid: Number(startingBid),
    highestBid: Number(startingBid), // ✅ initialize highestBid to startingBid
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

// ✅ Delete auction by ID (Admin only)
router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    await auction.deleteOne();
    res.json({ message: "Auction removed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Place a bid on an auction
router.post("/:id/bid", auth, async (req, res) => {
  const { bidAmount } = req.body;

  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    const current = auction.highestBid > 0 ? auction.highestBid : auction.startingBid;

    if (bidAmount <= current) {
      return res.status(400).json({
        message: `Bid must be greater than the current bid (₹${current})`
      });
    }

    auction.highestBid = bidAmount;
    await auction.save();

    res.json({ success: true, message: "Bid placed successfully!", auction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
