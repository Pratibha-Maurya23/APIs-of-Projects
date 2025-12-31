const express = require("express");
const jwt = require("jsonwebtoken");
const { refreshTokens } = require("../utils/tokenStore");
const { registerUser, loginUser, logoutUser } = require("../controllers/authController");

const authRouter = express.Router();

// 🔹 Register & Login routes
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);

authRouter.post("/refresh-token", (req, res) => {
  try{
  const  token  = req.body?.refreshTokens || req.cookies?.refreshToken;

  if (!token) return res.status(401).json({ message: "No refresh token ❌" });

  if (!refreshTokens.includes(token))
    return res.status(403).json({ message: "Invalid refresh token ❌" });

  jwt.verify(token, process.env.REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token expired ❌" });

    const newAccessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ accessToken: newAccessToken });
  });
} catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = {authRouter};