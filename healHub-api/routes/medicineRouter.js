const express = require("express");
const Medicine = require("../models/Medicine");
const { auth, roleCheck } = require("../middleware/auth");

const mediRouter = express.Router();

mediRouter.post("/add",auth,roleCheck("pharmacist"),async(req,res)=>{
  try{
    const{name,description,price,quantity,expiryDate,pharmacyName,isAvailable} = req.body;
    if(!name||!price||!quantity||!expiryDate||!pharmacyName){
      return res.status(400).json({message:"name, price, quantity, expiryDate, pharmacyName required"});
    }
    const medicine = await Medicine.create({name,
      description,
      price,
      quantity,
      expiryDate,
      pharmacyName,
      isAvailable,})
      res.status(201).json({
      message: "Medicine added successfully ✅",
      medicine,
    });
  }catch(err){
    console.error("Add medicine error:",err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

mediRouter.get("/all",async(req, res)=>{
  try{
    const medicine = await Medicine.find().sort({createdAt:-1});
    res.json(medicine);
  }catch(err){
    console.error("Get medicines error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
})


mediRouter.put("/edit/:id",auth,roleCheck("pharmacist"), async (req, res) => {
  try {
    const { price, quantity } = req.body;

    const updatedMedicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      {
        price,
        quantity,
        available: quantity > 0
      },
      { new: true }
    );

    res.json({
      message: "Medicine updated ✅",
      medicine: updatedMedicine
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

mediRouter.delete("/delete/:id",auth,roleCheck("pharmacist"), async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ message: "Medicine deleted ✅" });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = mediRouter;