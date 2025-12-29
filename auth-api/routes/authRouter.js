const express = require("express");
const jwt = require("jsonwebtoken");
const { refreshTokens } = require("../utils/tokenStore");
const { registerUser, loginUser } = require("../controllers/authController");

const authRouter = express.Router();

// 🔹 Register & Login routes
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

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

authRouter.post("/logout",(req,res)=>{
  const {token} = req.body;
  refreshTokens = refreshTokens.filter((t)=> t !== token);
  if (!req.headers.authorization) {
  return res.status(200).json({ message: "Already logged out" });
}
});

module.exports = {authRouter};