const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Remove 'Bearer ' prefix if it exists
const token = req.header("Authorization"); // correct for raw token


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId; // Save userId into req.user
    next(); // Proceed to the next middleware
  } catch (err) {
    console.error("Token validation failed:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
