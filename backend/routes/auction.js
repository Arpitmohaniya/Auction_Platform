const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const Auction = require("../models/Auction");

// GET /api/auction
router.get("/", authenticateToken, async (req, res) => {
  try {
    const auctions = await Auction.find().sort({ createdAt: -1 });
    res.json(auctions);
  } catch (err) {
    console.error("Failed to fetch auctions", err);
    res.status(500).json({ message: "Server error fetching auctions" });
  }
});

// POST /api/auction
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, description, startingBid } = req.body;
    const auction = new Auction({
      title,
      description,
      startingBid,
      createdBy: req.userId,
    });
    await auction.save();
    res.status(201).json(auction);
  } catch (err) {
    console.error("Error creating auction:", err);
    res.status(500).json({ message: "Failed to create auction" });
  }
});

module.exports = router;
