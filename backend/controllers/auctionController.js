const Auction = require("../models/Auction");
const multer = require("multer");
const path = require("path");

// Multer config
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Export upload middleware to use in route
exports.upload = upload;

// Controller to create auction
exports.createAuction = async (req, res) => {
  try {
    const {
      title,
      description,
      details,
      startingBid,
      condition,
      warranty,
      location,
      contactInfo,
      endTime,
    } = req.body;

    const imageUrls = req.files.map(file => file.path);

    const auction = new Auction({
      title,
      description,
      details,
      startingBid,
      highestBid: startingBid,
      condition,
      warranty,
      location,
      contactInfo,
      imageUrls,
      createdBy: req.user._id,
      status: "Live",
      endTime,
    });

    await auction.save();
    res.status(201).json({ message: "Auction created!", auction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
