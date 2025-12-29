// routes/userRouter.js
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const {auth, roleCheck} = require("../middleware/auth");

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
userRouter.get("/",auth,async(req,res)=>{
  try{
    const users = await User.find({},"-password");
    res.json(users);
  }catch(err){
    res.status(500).json({message: err.message});
  }
})

// Get single user by ID
userRouter.get("/:id",auth, async (req,res)=>{
  try{
    const user = await User.findById(req.params.id,"-password");
    if(!user) return res.status(404).json({message:"User not found ❌"});
    res.json(user);
  }catch(err){
    res.status(500).json({message: err.message});
  }
})

// update the password
userRouter.put("/:id",auth,async (req,res)=>{
  try{
    const updates = req.body;
    if(updates.password){
      updates.password = await bcrypt.hash(updates.password,10);
    }
    const updateUser = await User.findByIdAndUpdate(req.params.id,updates,{new:true});
    if(!updateUser) return res.status(404).json({message:"User not found ❌"});

    res.json(updateUser);
  }catch(err){
    res.status(500).json({message: err.message});
  }
})

// delete user
userRouter.delete("/:id", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found ❌" });
    }
    res.json({ message: "User deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = userRouter;