import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  admissionNo: { type: String, unique: true },
  password: String,
  name: String,
  email: String,
  phone: String,
  address: String,
  dob: String,
  course: String,
  year: Number,
  status: { type: String, default: "Active" },
});

export default mongoose.model("Student", studentSchema);
