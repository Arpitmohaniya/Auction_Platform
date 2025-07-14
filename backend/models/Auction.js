const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const auctionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    details: { type: String, required: true },
    startingBid: { type: Number, required: true },
    highestBid: { type: Number, default: 0 },
    bids: [bidSchema],
    condition: { type: String },
    warranty: { type: String },
    location: { type: String },
    contactInfo: { type: String },
    imageUrl: { type: String }, // ✅ SINGLE image only
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, default: "Live" },
    endTime: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Auction", auctionSchema);
