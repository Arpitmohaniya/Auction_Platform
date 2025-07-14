const express = require("express");
const router = express.Router();
const Auction = require("../models/Auction");
const upload = require("../middleware/upload");
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

// ✅ Create new auction (Single image only)
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      description,
      details,
      startingBid,
      status,
      condition,
      warranty,
      location,
      contactInfo,
      endTime, // ✅ Make sure endTime is passed from frontend!
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required." });
    }

    const auction = new Auction({
      title,
      description,
      details,
      startingBid: Number(startingBid),
      status: status || "Live",
      condition,
      warranty,
      location,
      contactInfo,
      imageUrl: req.file.path, // ✅ SINGLE image
      createdBy: req.user.id,
      endTime: endTime, // ✅ Required in your schema
    });

    await auction.save();
    res.status(201).json({ success: true, auction });

  } catch (err) {
    console.error("❌ Create auction error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
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

// ✅ Get single auction by ID
router.get("/:id", async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate("createdBy", "name")
      .populate("bids.user", "name");

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    res.json({ success: true, auction });
  } catch (err) {
    console.error("❌ Get auction error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Delete auction (Admin only)
router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    await auction.deleteOne();
    res.json({ success: true, message: "Auction deleted successfully." });
  } catch (err) {
    console.error("❌ Delete auction error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Place a bid
router.post("/:id/bid", auth, async (req, res) => {
  const { bidAmount } = req.body;

  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    const currentBid = auction.highestBid > 0 ? auction.highestBid : auction.startingBid;

    if (bidAmount <= currentBid) {
      return res.status(400).json({
        message: `Bid must be greater than the current bid (₹${currentBid})`,
      });
    }

    auction.highestBid = bidAmount;
    auction.bids.push({
      user: req.user.id,
      amount: bidAmount,
    });

    await auction.save();

    res.json({ success: true, message: "Bid placed successfully!", auction });
  } catch (err) {
    console.error("❌ Place bid error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
