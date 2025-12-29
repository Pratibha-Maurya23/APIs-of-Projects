const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name:{ 
    type: String,
    required: true,
    trim: true,
  },
  description:{
    type : String,
    default:"",
  },
  price:{
    type:Number,
    required:true,
    min:0,
  },
  quantity:{
    type:Number,
    required:true,
    min:0,
  },
  expiryDate:{
    type:Date,
    required:true,
  },
  pharmacyName:{
    type:String,
    require:true,
  },
  isAvailable:{
    type:Boolean,
    default:true,
  },
},
{timestamps:true});
module.exports = mongoose.model("Medicine", medicineSchema);
