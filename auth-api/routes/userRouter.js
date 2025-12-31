// routes/userRouter.js
const express = require("express");
const {auth, roleCheck} = require("../middleware/auth");
const {getAllUser, getSingleUser, putPassword, deleteUser} = require("../controllers/userController");

const userRouter = express.Router();

// Protected Route using middleware
userRouter.get(
  "/profile",
  auth,
  roleCheck(["user", "admin"]),
  (req, res) => {
    res.json({ message: "Access Granted ✅", user: req.user });
  }
);

// get all users 
userRouter.get("/",auth, getAllUser);

// Get single user by ID
userRouter.get("/:id",auth, getSingleUser);

// update the password
userRouter.put("/:id",auth, putPassword);

// delete user
userRouter.delete("/:id", auth, deleteUser);

module.exports = userRouter;