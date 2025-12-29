const jwt = require("jsonwebtoken");
require("dotenv").config();

// 🔐 AUTH MIDDLEWARE
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token ❌" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token ❌" });

    req.user = user;   // user must contain role
    next();
  });
};

// ✅ ROLE CHECK MIDDLEWARE
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied ❌" });
    }
    next();
  };
};

module.exports = { auth, roleCheck };

