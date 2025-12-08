import express from "express";
import Student from "../models/Student.js";
import bcrypt from "bcrypt";
import requireAuth from "../middleware/auth.js"
import PDFDocument from "pdfkit";
// import twilio from "twilio";

// const client = twilio(
//   process.env.TWILIO_SID,
//   process.env.TWILIO_AUTH
// );

const authRoutes = express.Router();

authRoutes.get("/me", requireAuth, async (req, res) => {
  const student = await Student.findById(req.session.studentId);
  res.json(student);
});
  

// ✅ ADMISSION
authRoutes.post("/admission", async (req, res) => {
  try{
  const admissionNo = "ADM" + new Date().getFullYear() + Math.floor(1000 + Math.random() * 9000);
  const plainPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const student = new Student({
    ...req.body,
    admissionNo,
    password: hashedPassword,
    payment: { status: "PENDING" },
  });

  await student.save();

  // ✅ respond FIRST
  res.json({studentId: student._id,  message: "Admission successful",});

    // ✅ SEND SMS 
//     try{
//   await client.messages.create({
//   from: `whatsapp:+917755855131`,
//   to: `whatsapp:+91${student.phone}`,
//   body: `🎓 Admission Successful!
// Admission No: ${admissionNo}
// Password: ${plainPassword}`,
// });
//   }catch (smsErr) {
//       console.error("SMS FAILED:", smsErr.message);
//     }

}catch (err) {
    if (err.code === 11000) {
    return res.status(400).json({
      message: "Student already exists with this Email or Aadhar"
    });
  }
    console.error(err);
    res.status(500).json({ message: "Admission failed" });
  }
});

// ✅ LOGIN
authRoutes.post("/login", async (req, res) => {
  try{
  const { admissionNo, password } = req.body;

  if (!admissionNo || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

  const student = await Student.findOne({ admissionNo });

  if (!student) {
    return res.status(401).json({ message: "Student is Not Found" });
  }
  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid Password" });
  }
  req.session.studentId = student._id;

  res.json({
  student: {
    _id: student._id,
    admissionNo: student.admissionNo,
    name: student.name,
    email: student.email,       
    phone: student.phone,        
    address: student.address,  
    dob: student.dob,            
    course: student.course,
    branch: student.branch,
    year: student.year,
    qualifications: student.qualifications,            
    payment: student.payment,
  }
});

}catch(err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

authRoutes.post("/forgot-password", async (req, res) => {
  try {
    const { admissionNo, newPassword } = req.body;

    // ✅ check student exists
    const student = await Student.findOne({ admissionNo});
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // ✅ update password
    student.password = hashedPassword;
    await student.save();

    res.json({ message: "Password updated successfully ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


authRoutes.post("/logout", (req, res) => {
   req.session.destroy(() => {
    res.clearCookie("admission.sid");
    res.json({ message: "Logged out" });
  });
});

authRoutes.post("/payment", async (req, res) => {
  try {
    const { studentId, amount, method, transactionId } = req.body;

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // basic verification for demo
    const EXPECTED_AMOUNT = 50000;
    if (amount !== EXPECTED_AMOUNT) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (student.payment?.status === "PAID") {
      return res.status(400).json({ message: "Already paid" });
    }

    student.payment = {
      status: "PAID",
      amount,
      method,
      transactionId: transactionId || `TXN-${Date.now()}`,
      paidAt: new Date(),
    };

    await student.save();

    res.json({
      message: "Payment successful ✅",
      studentId: student._id,
    });
  } catch (err) {
    console.error("PAYMENT ERROR:", err);
    res.status(500).json({ message: "Payment failed" });
  }
});

authRoutes.get("/receipt/:studentId", async (req, res) => {
  const student = await Student.findById(req.params.studentId);

  if (!student || student.payment?.status !== "PAID") {
    return res.status(404).json({ message: "Receipt not found" });
  }

  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=receipt.pdf");

  doc.pipe(res);

  doc.fontSize(20).text("Admission Fee Receipt", { align: "center" });
  doc.moveDown();

  doc.text(`Name: ${student.name}`);
  doc.text(`Admission No: ${student.admissionNo}`);
  doc.text(`Course: ${student.course}`);
  doc.text(`Amount Paid: ₹${student.payment.amount}`);
  doc.text(`Transaction ID: ${student.payment.transactionId}`);
  doc.text(`Date: ${student.payment.paidAt.toDateString()}`);

  doc.end();
});


export default authRoutes;









