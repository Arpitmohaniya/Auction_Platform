const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  details: { type: String, required: true },
  startingBid: { type: Number, required: true },
  highestBid: { type: Number, default: 0 },
  status: { type: String, enum: ["Live", "Upcoming", "Closed"], default: "Live" }, 
  condition: { type: String },
  warranty: { type: String },
  location: { type: String },
  contactInfo: { type: String },
  imageUrl: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });


module.exports = mongoose.model("Auction", auctionSchema);
