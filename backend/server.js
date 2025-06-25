const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ✅ Use CORS with explicit origin for safety
app.use(cors({
  origin: "http://localhost:3000", // allow React app
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo Error:", err));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/auction", require("./routes/auction"));

app.get("/", (req, res) => {
  res.send("✅ Backend is working!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
