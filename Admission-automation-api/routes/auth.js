import express from "express";
import Student from "../models/Student.js";
import bcrypt from "bcrypt";
import requireAuth from "../middleware/auth.js"

const authRoutes = express.Router();

authRoutes.get("/me", requireAuth, async (req, res) => {
  const student = await Student.findById(req.session.studentId);
  res.json(student);
});


// Generate credentials
const generateAdmissionNo = () =>
  "ADM" + new Date().getFullYear() + Math.floor(1000 + Math.random() * 9000);

// ✅ ADMISSION
authRoutes.post("/admission", async (req, res) => {
  try{
  const admissionNo = generateAdmissionNo();
  const plainPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const student = new Student({
    ...req.body,
    admissionNo,
    password: hashedPassword,
    payment: { status: "PENDING" },
  });

  await student.save();

  res.json({ admissionNo, studentId: student._id});
}catch (err) {
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
    admissionNo: student.admissionNo,
    name: student.name,
    course: student.course,
    branch: student.branch,
    year: student.year,
    payment: student.payment
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

export default authRoutes;




