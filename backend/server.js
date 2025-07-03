const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();



const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

// ✅ Serve uploads folder statically (keep this only ONCE)
app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo Error:", err));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/auction", require("./routes/auction"));

app.get("/", (req, res) => {
  res.send("✅ Backend is working!");
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
