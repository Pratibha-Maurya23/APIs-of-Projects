const bcrypt = require("bcryptjs");
const User = require("../models/User");


// get all users 
exports.getAllUser = async(req,res)=>{
  try{
    const users = await User.find({},"-password");
    res.json(users);
  }catch(err){
    res.status(500).json({message: err.message});
  }
}

// Get single user by ID
exports.getSingleUser = async (req,res)=>{
  try{
    const user = await User.findById(req.params.id,"-password");
    if(!user) return res.status(404).json({message:"User not found ❌"});
    res.json(user);
  }catch(err){
    res.status(500).json({message: err.message});
  }
}

// update the password
exports.putPassword = async (req,res)=>{
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
}

// delete user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found ❌" });
    }
    res.json({ message: "User deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
