const isAdmin = (req, res, next) => {
  console.log("✅ ISADMIN req.user:", req.user); // 👉 ADD THIS
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Admins only" });
  }
};

module.exports = isAdmin;
